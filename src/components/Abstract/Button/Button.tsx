import * as React from 'react';
import style from './button.module.scss';

const Button = ({
    children,
    className,
    icon,
    type = 'normal',
    disabled = false,
    onClick,
}: {
    children: React.ReactNode,
    className?: string,
    icon?: React.ReactNode,
    type?: 'normal' | 'primary' | 'primary-outline' | 'cancel' | 'cancel-outline',
    disabled?: boolean,
    onClick?: () => void,
}) => {
    return (
        <button disabled={disabled} className={style.button + ' ' + style[type] + ' ' + className} onClick={onClick}>
            <span className={style.text}>
                {children}
            </span>
            {icon && <span className={style.icon}>{icon}</span>}
        </button>
    );
};

export default Button;