import * as React from 'react';
import CrossIcon from 'components/Icons/CrossIcon';
import style from './popup.module.scss';

const Popup = (
    {
        isVisible = false,
        closePopup = () => {
            // do nothing
        },
        haveCloseButton = false,
        children,
        topIcon,
        className = '',
    }: {
        isVisible?: boolean,
        closePopup?: () => void,
        haveCloseButton?: boolean,
        children: React.ReactNode,
        topIcon?: React.ReactNode,
        className?: string,
    }
) => {
    return (
        <div className={style.popup + ' ' + (isVisible ? style.visible : '') + ' ' + className}>
            <div className={style.content}>
                {
                    haveCloseButton && (
                        <div className={style.close} onClick={closePopup}>
                            <CrossIcon className={style.icon} />
                        </div>
                    )
                }
                {
                    topIcon && (
                        <div className={style['top-icon']}>
                            {topIcon}
                        </div>
                    )
                }
                {children}
            </div>
        </div >
    );
};

export default Popup;