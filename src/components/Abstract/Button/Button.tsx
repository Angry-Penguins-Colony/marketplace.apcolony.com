import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import style from './button.module.scss';

export type ButtonType = 'normal' | 'primary' | 'primary-outline' | 'cancel' | 'cancel-outline';

const Button = ({
    children,
    className,
    icon,
    type = 'normal',
    disabled = false,
    link,
    onClick,
}: {
    children: React.ReactNode,
    className?: string,
    icon?: React.ReactNode,
    type?: ButtonType,
    disabled?: boolean,
    onClick?: () => void,
    link?: string
}) => {

    const navigate = useNavigate();

    const handleClick = () => {
        if (onClick) {
            onClick();
        }

        if (link) {
            navigate(link);
        }
    }

    return (
        <button disabled={disabled} className={style.button + ' ' + style[type] + ' ' + className} onClick={handleClick}>
            <span className={style.text}>
                {children}
            </span>
            {icon && <span className={style.icon}>{icon}</span>}
        </button>
    );
};

export default Button;