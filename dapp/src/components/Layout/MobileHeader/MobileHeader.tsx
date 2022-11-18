import React from 'react';
import { useNavigate } from 'react-router-dom';
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

    const navigate = useNavigate();

    return (
        <div id={style['mobile-header']} className={className + ' ' + style[type]}>

            <div className={style.titles}>
                <h1>
                    <BackIcon className={style.icon + ' ' + 'float-left'} onClick={navigateBack} />
                    {title}
                </h1>
                {
                    subTitle &&
                    <h2>{subTitle}</h2>
                }
            </div>

            <div className={style.icon} onClick={onRightIconClick}>
                {/* {
                    rightIcon ? (
                        rightIcon
                    ) : (
                        <KebabIcon />
                    )
                } */}
            </div>
        </div>
    );

    function navigateBack() {
        console.log('go back');
        navigate(-1);
    }
};

export default Footer;