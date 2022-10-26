import React from 'react';
import { useGetAccountInfo } from '@elrondnetwork/dapp-core/hooks';
import { Link, useNavigate } from 'react-router-dom';
import APCLogoColored from 'assets/img/apc-logo/colored.png';
import LoginLogoutButton from 'components/Buttons/LoginLogoutButton';
import SocialButtons from 'components/Buttons/SocialButtons';
import HomeIcon from 'components/Icons/HomeIcon';
import LabIcon from 'components/Icons/LabIcon';
import MenuIcon from 'components/Icons/MenuIcon';
import ProfileIcon from 'components/Icons/ProfileIcon';
import { buildRouteLinks, routeNames } from 'routes';
import MobileMenu from '../MobileMenu/MobileMenu';
import style from './navbar.module.scss';

interface NavItem {
  name: string,
  route?: string,
  icon?: JSX.Element,
  visibleIfConnected?: boolean,
  className?: string;
  mobileOnly?: boolean;
  type?: 'mobile-nav-bar' | 'mobile-menu';
  nestedItems?: NavItem[];
  onClick?: () => void;
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
      type: 'mobile-menu',
      nestedItems: [
        {
          name: 'Penguins',
          route: routeNames.penguinsOffers,
          type: 'mobile-menu',
        },
        {
          name: 'Items',
          route: routeNames.itemsOffersNavigator,
          type: 'mobile-menu',
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
      route: buildRouteLinks.customize(1),
      icon: <LabIcon />,
      className: style.labIcon,
      visibleIfConnected: true,
    },
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
            .filter((item) => !item.mobileOnly)
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
      <span className={style.itemName}>
        {item.name}
      </span>
      <div className={style.nestedDropdown}>
        <div className={style.container} >

          <div className={style.underline} />
          <div className={style.flex}>
            {item.nestedItems.map((nestedItem, index) => <DesktopHeaderItem item={nestedItem} key={index} />)}
          </div>
        </div>
      </div>
    </div>
  }
  else {
    return <a href={item.route} className={style.item}>{item.name}</a>;
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

  const mobileMenuItems = navItems.filter((item) => !item.type || item.type == 'mobile-menu');

  const navBarItems = navItems.filter((item) => !item.type || item.type == 'mobile-nav-bar');

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

