import React from 'react';
import { useGetAccountInfo } from '@elrondnetwork/dapp-core/hooks';
import LoginLogoutButton from 'components/Buttons/LoginLogoutButton';
import DiscordIcon from 'components/Icons/DiscordIcon';
import HomeIcon from 'components/Icons/HomeIcon';
import LabIcon from 'components/Icons/LabIcon';
import ProfileIcon from 'components/Icons/ProfileIcon';
import TwitterIcon from 'components/Icons/TwitterIcon';
import { buildRouteLinks, routeNames } from 'routes';
import MobileMenu from '../MobileMenu/MobileMenu';
import style from './navbar.module.scss';

interface NavItem {
  name: string,
  route: string,
  icon: JSX.Element,
  visibleIfConnected?: boolean,
  className?: string;
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
    // {
    //   name: 'Menu',
    //   onClick: () => {
    //     setMobileMenuIsOpen(true);
    //   },
    //   icon: <MenuIcon />,
    // },
  ];

  const visibleNavItems = navItems
    .filter((item) => !item.visibleIfConnected || (item.visibleIfConnected && isConnected));

  const [mobileMenuIsOpen, setMobileMenuIsOpen] = React.useState<boolean>(false);

  return (
    <>
      <MobileMenu navItems={navItems.filter((item) => item.name !== 'Menu')} isOpen={mobileMenuIsOpen} onClose={() => setMobileMenuIsOpen(false)} />
      <div id="NavBar" className={style.navbar}>
        {
          visibleNavItems.map((item, index) => (
            <div className={
              style.navItem
              + ' ' + item.className
              + ((item.route && item.route === window.location.pathname) ? ' ' + style.active : '')
            } key={index} onClick={() => (
              item.onClick ?
                item.onClick() :
                window.location.href = item.route
            )}>
              {
                React.cloneElement(
                  item.icon,
                  {
                    fulfill: (item.route && item.route === window.location.pathname),
                    className: style.icon,
                  }
                )
              }
              <p>{item.name}</p>
            </div>
          ))
        }
      </div>
      <div id={style['desktop-header']}>
        <header>
          <div className={style.left}>
            <img src="/img/logo/logo.png" alt="Logo Angry Penguins" onClick={function () {
              window.location.href = routeNames.home;
            }} />
            <nav>
              {/* TODO: bind nav link */}
              {
                visibleNavItems
                  .map((item, index) => {
                    return <a href={item.route} key={index} className={style.item}>{item.name}</a>
                  })
              }
            </nav>
          </div>
          <div className={style.center}>
            {/* <div className={style.search}>
              <SearchIcon className={style.icon} />
              <input type="text" placeholder="Search..." />
            </div> */}
          </div>
          <div className={style.right}>
            <div className={style.social}>
              <div className={style.twitter + ' ' + style.icon}>
                <TwitterIcon />
              </div>
              <div className={style.discord + ' ' + style.icon}>
                <DiscordIcon />
              </div>
            </div>

            <LoginLogoutButton btnClassName={style.button} />
          </div>
        </header>
      </div >
    </>
  );
};

export default Navbar;
