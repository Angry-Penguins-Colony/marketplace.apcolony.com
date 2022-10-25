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
  icon: JSX.Element,
  visibleIfConnected?: boolean,
  className?: string;
  mobileOnly?: boolean;
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
  return <a href={item.route} className={style.item}>{item.name}</a>;
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

  return <>
    <MobileMenu navItems={navItems.filter((item) => item.name !== 'Menu')} isOpen={mobileMenuIsOpen} onClose={() => setMobileMenuIsOpen(false)} />

    <div id="NavBar" className={style.navbar}>
      {navItems.map((item, index) => <MobileNavBarItem item={item} key={index} />)}
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

