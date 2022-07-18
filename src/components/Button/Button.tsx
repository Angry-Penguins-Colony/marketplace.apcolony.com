import * as React from 'react';
import style from './button.module.scss';

const Button = ({
    children,
    className,
    icon,
}: {
    children: React.ReactNode,
    className?: string,
    icon?: React.ReactNode,
}) => {
    return (
        <button className={style.button + ' ' + className}>
            <span className={style.text}>
                {children}
            </span>
            {icon && <span className={style.icon}>{icon}</span>}
        </button>
    );
};

export default Button;