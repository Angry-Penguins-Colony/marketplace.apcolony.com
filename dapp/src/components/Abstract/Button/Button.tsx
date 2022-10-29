import * as React from 'react';
import { Link, useNavigate } from 'react-router-dom';
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


    return withLink(
        <button disabled={disabled} className={style.button + ' ' + style[type] + ' ' + className} onClick={handleClick}>
            <span className={style.text}>
                {children}
            </span>
            {icon && <span className={style.icon}>{icon}</span>}
        </button>
    );

    function withLink(_children: JSX.Element) {
        if (link) {
            return <Link to={link}>{_children}</Link>;
        }
        else {
            return _children;
        }
    }
};

export default Button;