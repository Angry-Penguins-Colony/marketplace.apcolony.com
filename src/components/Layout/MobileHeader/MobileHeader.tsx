import React from 'react';
import BackIcon from 'components/Icons/BackIcon';
import KebabIcon from 'components/Icons/KebabIcon';
import style from './mobile-header.module.scss';

const Footer = ({
    title,
    subTitle = undefined,
    className = ''
}: {
    title: string,
    subTitle?: string,
    className?: string
}) => {
    return (
        <div id={style['mobile-header']} className={className}>
            <BackIcon className={style.icon} />
            <div className={style.titles}>
                <h1>{title}</h1>
                {
                    subTitle &&
                    <h2>{subTitle}</h2>
                }
            </div>
            <KebabIcon className={style.icon} />
        </div>
    );
};

export default Footer;