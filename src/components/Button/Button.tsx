import * as React from 'react';
import style from './button.module.scss';

const Button = ({
    children,
    className,
    icon,
    type = 'normal',
}: {
    children: React.ReactNode,
    className?: string,
    icon?: React.ReactNode,
    type?: 'normal' | 'primary' | 'cancel',
}) => {
    return (
        <button className={style.button + ' ' + style[type] + ' ' + className}>
            <span className={style.text}>
                {children}
            </span>
            {icon && <span className={style.icon}>{icon}</span>}
        </button>
    );
};

export default Button;