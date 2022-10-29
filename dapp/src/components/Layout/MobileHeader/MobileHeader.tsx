import React from 'react';
import BackIcon from 'components/Icons/BackIcon';
import KebabIcon from 'components/Icons/KebabIcon';
import style from './mobile-header.module.scss';

const Footer = ({
    title,
    subTitle = undefined,
    className = '',
    rightIcon = undefined,
    onRightIconClick = () => {
        // do nothing
    },
    type = 'transparent',
}: {
    title: string,
    subTitle?: string,
    className?: string,
    rightIcon?: React.ReactNode,
    onRightIconClick?: () => void,
    type?: 'transparent' | 'light',
}) => {
    return (
        <div id={style['mobile-header']} className={className + ' ' + style[type]}>
            <div className={style.icon} onClick={() => {
                window.history.back();
            }}>
                <BackIcon className={style.icon} />
            </div>
            <div className={style.titles}>
                <h1>{title}</h1>
                {
                    subTitle &&
                    <h2>{subTitle}</h2>
                }
            </div>
            <div className={style.icon} onClick={onRightIconClick}>
                {
                    rightIcon ? (
                        rightIcon
                    ) : (
                        <KebabIcon />
                    )
                }
            </div>
        </div>
    );
};

export default Footer;