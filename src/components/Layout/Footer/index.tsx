import React from 'react';
import DiscordIcon from 'components/Icons/DiscordIcon';
import TwitterIcon from 'components/Icons/TwitterIcon';
import style from './footer.module.scss';

// TODO: bind newsletter mailchimp form

const Footer = () => {
  return (
    <footer id={style['main-footer']}>
      <div className={style.newsletter}>
        <h2>Get the latest updates,<br />
          highlights and team activities</h2>
        <form action="">
          <input type="email" placeholder="E-mail..." />
          <button type="submit">Sign In</button>
        </form>
        <div className={style['join-us']}>
          <h2>Join Us</h2>
          <div className={style.social}>
            <div className={style.twitter + ' ' + style.icon}>
              <TwitterIcon />
            </div>
            <div className={style.discord + ' ' + style.icon}>
              <DiscordIcon />
            </div>
          </div>
        </div>
      </div>
      {/* TODO: footer with nav etc */}
    </footer>
  );
};

export default Footer;
