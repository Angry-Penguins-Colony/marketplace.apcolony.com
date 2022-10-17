import React from 'react';
import { useGetAccountInfo } from '@elrondnetwork/dapp-core/hooks';
import DiscordIcon from 'components/Icons/DiscordIcon';
import HomeIcon from 'components/Icons/HomeIcon';
import LabIcon from 'components/Icons/LabIcon';
import MenuIcon from 'components/Icons/MenuIcon';
import ProfileIcon from 'components/Icons/ProfileIcon';
import SearchIcon from 'components/Icons/SearchIcon';
import TwitterIcon from 'components/Icons/TwitterIcon';
import LoginButton from 'components/LoginButton';
import { buildRouteLinks, routeNames } from 'routes';
import MobileMenu from '../MobileMenu/MobileMenu';
import style from './navbar.module.scss';

const Navbar = () => {

  const { address } = useGetAccountInfo();
  const isConnected = !!address;

  const navItems = [
    {
      name: 'Home',
      route: routeNames.home,
      icon: <HomeIcon />,
    },
    {
      name: 'My Inventory',
      route: buildRouteLinks.inventory(address),
      icon: <ProfileIcon />,
      authenticated: true,
    },
    {
      name: 'Customize',
      route: buildRouteLinks.customize(1),
      icon: <LabIcon />,
      className: style.labIcon,
      authenticated: true,
    },
    {
      name: 'Menu',
      action: () => {
        setMobileMenuIsOpen(true);
      },
      icon: <MenuIcon />,
    },
  ];

  const [mobileMenuIsOpen, setMobileMenuIsOpen] = React.useState<boolean>(false);

  return (
    <>
      <MobileMenu navItems={navItems.filter((item) => item.name !== 'Menu')} isOpen={mobileMenuIsOpen} onClose={() => setMobileMenuIsOpen(false)} />
      <div id="NavBar" className={style.navbar}>
        {
          navItems.map((item, index) => (
            <div className={
              style.navItem
              + ' ' + item.className
              + ((item.route && item.route === window.location.pathname) ? ' ' + style.active : '')
            } key={index} onClick={() => (
              item.action ?
                item.action() :
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
                navItems.map((item, index) => {
                  if (item.name != 'Menu' && (!item.authenticated || (item.authenticated && isConnected))) {
                    return (<a href={item.route} key={index} className={style.item}>{item.name}</a>);
                  }
                })
              }
            </nav>
          </div>
          <div className={style.center}>
            <div className={style.search}>
              <SearchIcon className={style.icon} />
              <input type="text" placeholder="Search..." />
              {/* TODO: connect search bar */}
            </div>
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

            <LoginButton />
          </div>
        </header>
      </div >
    </>
  );
};

export default Navbar;
