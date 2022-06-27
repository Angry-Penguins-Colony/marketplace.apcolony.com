import React from 'react';
import DiscordIcon from 'components/Icons/DiscordIcon';
import HomeIcon from 'components/Icons/HomeIcon';
import LabIcon from 'components/Icons/LabIcon';
import MarketIcon from 'components/Icons/MarketIcon';
import MenuIcon from 'components/Icons/MenuIcon';
import ProfileIcon from 'components/Icons/ProfileIcon';
import TwitterIcon from 'components/Icons/TwitterIcon';
import style from './navbar.module.scss';

const Navbar = () => {
  const navItems = [
    {
      name: 'Home',
      route: '/',
      icon: <HomeIcon />,
    },
    {
      name: 'Inventory',
      route: '/inventory',
      icon: <ProfileIcon />,
    },
    {
      name: 'Marketplace',
      action: () => {
        console.log('Marketplace');
        // TODO: open Marketplace
      },
      icon: <MarketIcon />,
      className: style.marketIcon,
    },
    {
      name: 'Lab',
      action: () => {
        console.log('lab');
        // TODO: open lab
      },
      icon: <LabIcon />,
      className: style.labIcon,
    },
    {
      name: 'Menu',
      action: () => {
        console.log('menu');
        // TODO: open menu
      },
      icon: <MenuIcon />,
    },
  ];

  return (
    <>
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
            <img src="/img/logo/logo.png" alt="Logo Angry Penguins" />
            <nav>
              <div className={style.item}>Home</div>
              <div className={style.item}>Shop</div>
              <div className={style.item}>My Inventory</div>
              <div className={style.item}>Customize</div>
            </nav>
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
            <div className={style.profile}>
              <img src="/img/pingouin emperor.png" alt="Your profile image" />
            </div>
          </div>
        </header>
      </div>
    </>
  );
};

export default Navbar;
