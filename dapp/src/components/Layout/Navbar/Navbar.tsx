import React from 'react';
import { useGetAccountInfo } from '@multiversx/sdk-dapp/hooks';
import { Link, useNavigate } from 'react-router-dom';
import APCLogoColored from 'assets/img/apc-logo/colored.png';
import LoginLogoutButton from 'components/Buttons/LoginLogoutButton';
import SocialButtons from 'components/Buttons/SocialButtons';
import HomeIcon from 'components/Icons/HomeIcon';
import LabIcon from 'components/Icons/LabIcon';
import MenuIcon from 'components/Icons/MenuIcon';
import StakeIcon from 'components/Icons/StakeIcon'
import ProfileIcon from 'components/Icons/ProfileIcon';
import { hatchLink } from 'config';
import { buildRouteLinks, routeNames } from 'routes';
import MobileMenu from '../MobileMenu/MobileMenu';
import style from './navbar.module.scss';

interface NavItem {
  name: string,
  route?: string,
  icon?: JSX.Element,
  visibleIfConnected?: boolean,
  className?: string;
  mobileType?: 'nav-bar' | 'menu' | 'none';
  nestedItems?: NavItem[];
  onClick?: () => void;
  openInNewTab?: boolean;
}

const Navbar = () => {

  const { address } = useGetAccountInfo();
  const isConnected = !!address;

  const navItems: NavItem[] = [
    {
      name: 'Home',
      route: routeNames.home,
      icon: <HomeIcon />,
    },
    {
      name: 'Shop',
      mobileType: 'menu',
      nestedItems: [
        {
          name: 'Penguins',
          route: routeNames.penguinsHome,
          mobileType: 'menu',
        },
        {
          name: 'Items',
          route: routeNames.allItemsHome,
          mobileType: 'menu',
        },
        {
          name: 'Eggs',
          route: routeNames.eggsHome,
          mobileType: 'menu',
        }
      ]
    },
    {
      name: 'My Inventory',
      route: buildRouteLinks.inventory(address),
      icon: <ProfileIcon />,
      visibleIfConnected: true,
    },
    {
      name: 'Customize',
      route: routeNames.customizeInventory,
      icon: <LabIcon />,
      className: style.labIcon,
      visibleIfConnected: true,
    },
    {
      name: 'Staking',
      route: routeNames.staking,
      icon: <StakeIcon />,
      className: style.labIcon,
      visibleIfConnected: true,
    },
    {
      name: 'Hatch',
      route: hatchLink,
      mobileType: 'menu',
      openInNewTab: true,
    }
  ];

  const visibleNavItems = navItems
    .filter((item) => !item.visibleIfConnected || (item.visibleIfConnected && isConnected));


  return (
    <>
      <MobileNavBar navItems={visibleNavItems} />
      <DesktopHeader navItems={visibleNavItems} />
    </>
  );
};


const DesktopHeader = ({ navItems: visibleNavItems }: { navItems: NavItem[] }) => {
  return <div id={style['desktop-header']}>
    <header>
      <div className={style.left}>
        <Link to={routeNames.home}>
          <img src={APCLogoColored} alt="Logo Angry Penguins" />
        </Link>
        <nav>
          {visibleNavItems
            .map((item, index) => <DesktopHeaderItem item={item} key={index} />)}
        </nav>
      </div>
      <div className={style.center}>

      </div>
      <div className={style.right}>
        <SocialButtons className={style.social} />

        <LoginLogoutButton className={style.button} />
      </div>
    </header>
  </div>;
}

const DesktopHeaderItem = ({ item }: { item: NavItem }) => {
  if (item.nestedItems) {
    return <div className={style.item}>
      <div className={style.itemName}>
        {item.name}
      </div>
      <div className={style.nestedDropdown}>
        <div className={style.container} >

          <div className={style.underline} />
          <div className={style.flex}>
            {item.nestedItems.map((nestedItem, index) => <DesktopHeaderItem item={nestedItem} key={index} />)}
          </div>
        </div>
      </div>
    </div >
  }
  else {
    if (item.openInNewTab) {
      return <a href={item.route ?? routeNames.home} className={style.item} target="_blank" rel="noopener noreferrer">
        {item.name}
      </a>
    }
    else {
      return <Link to={item.route ?? routeNames.home} className={style.item}>
        {item.name}
      </Link>;
    }
  }
}

export default Navbar;

const MobileNavBar = ({ navItems }: { navItems: NavItem[], }) => {

  const [mobileMenuIsOpen, setMobileMenuIsOpen] = React.useState<boolean>(false);

  const openMenuButton: NavItem = {
    name: 'Menu',
    onClick: () => {
      setMobileMenuIsOpen(true);
    },
    icon: <MenuIcon />,
  };

  const mobileMenuItems = navItems.filter((item) => !item.mobileType || item.mobileType == 'menu');
  const navBarItems = navItems.filter((item) => !item.mobileType || item.mobileType == 'nav-bar');

  return <>
    <MobileMenu navItems={mobileMenuItems} isOpen={mobileMenuIsOpen} onClose={() => setMobileMenuIsOpen(false)} />

    <div id="NavBar" className={style.navbar}>
      {navBarItems.map((item, index) => <MobileNavBarItem item={item} key={index} />)}
      <MobileNavBarItem item={openMenuButton} />
    </div>
  </>;
}

const MobileNavBarItem = ({ item }: { item: NavItem }) => {
  const navigate = useNavigate();

  const isSelected = item.route && item.route === window.location.pathname;

  const className = [
    style.navItem,
    item.className,
    (isSelected ? ' ' + style.active : '')
  ].join(' ');

  const handleOnClick = () => {
    if (item.onClick) {
      item.onClick();
    } else if (item.route) {
      navigate(item.route);
    }
  }

  if (!item.icon) throw new Error(`MobileNavBarItem: icon is required for ${item.name}`);

  return <div className={className} onClick={handleOnClick}>
    {React.cloneElement(
      item.icon,
      {
        fulfill: isSelected,
        className: style.icon,
      }
    )}

    {/*  */}
    <p>{item.name}</p>
  </div>
}


