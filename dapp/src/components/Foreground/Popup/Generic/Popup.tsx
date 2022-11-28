import * as React from 'react';
import CrossIcon from 'components/Icons/CrossIcon';
import style from './popup.module.scss';

export interface IPopupProps {
    isVisible?: boolean;
    onCloseClicked?: () => void;
    haveCloseButton?: boolean;
    children?: React.ReactNode;
    topIcon?: React.ReactNode;
    className?: string;
    contentClassName?: string;
}

const Popup = (
    {
        isVisible = false,
        onCloseClicked = () => {
            // do nothing
        },
        haveCloseButton = false,
        children,
        topIcon,
        className = '',
        contentClassName = ''
    }: IPopupProps
) => {
    return (
        <div className={style.popup + ' ' + (isVisible ? style.visible : '') + ' ' + className}>
            <div className={style.content + ' ' + contentClassName}>
                {
                    haveCloseButton && (
                        <div className={style.close} onClick={onCloseClicked}>
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