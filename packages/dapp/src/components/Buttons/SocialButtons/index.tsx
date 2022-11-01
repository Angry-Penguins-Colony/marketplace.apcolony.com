import React from 'react';
import DiscordIcon from 'components/Icons/DiscordIcon';
import TwitterIcon from 'components/Icons/TwitterIcon'
import { discordInvitation, twitter } from 'config'
import style from './style.module.scss';

interface Props {
    className?: string;
}

const SocialButtons = ({ className = '' }: Props) => {
    return <div className={style.social + ' ' + className}>
        <TwitterButton />
        <DiscordInvitationButton />
    </div>
}

export default SocialButtons;

const TwitterButton = () => {

    return <a href={twitter} target="_blank" rel="noreferrer">
        <div className={style.twitter + ' ' + style.icon}>
            <TwitterIcon />
        </div>
    </a>;
};

const DiscordInvitationButton = () => {
    return <a href={discordInvitation} target="_blank" rel="noreferrer">
        <div className={style.discord + ' ' + style.icon}>
            <DiscordIcon />
        </div>
    </a>;
}