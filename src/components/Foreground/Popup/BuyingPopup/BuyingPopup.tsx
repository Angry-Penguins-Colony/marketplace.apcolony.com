import * as React from 'react';
import CrossIcon from 'components/Icons/CrossIcon';
import style from './BuyingPopup.module.scss';

const BuyingPopup = (
    {
        visible = false,
        closePopup,
        className = '',
        children
    }: {
        visible?: boolean;
        closePopup: () => void;
        className?: string;
        children: React.ReactNode;
    }
) => {
    return (
        <div className={style.popup + ' ' + className + ' ' + (visible ? style.visible : '')}>
            <div className={style.content}>
                <div className={style.close} onClick={closePopup}>
                    <CrossIcon className={style.icon} />
                </div>
                {children}
            </div>
        </div>
    );
};

export default BuyingPopup;