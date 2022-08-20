import * as React from 'react';
import style from './underline-nav-elmt.module.scss';

const UnderlineNavElmt = (
    {
        name,
        isActive = false,
        onClick = () => {
            // do nothing
        },
        className = '',
    }: {
        name: string,
        isActive?: boolean;
        onClick?: () => void;
        className?: string,
    }
) => {
    return (
        <div className={style.elmt + (isActive ? ' ' + style.active : '') + ' ' + className} onClick={onClick}>{name}</div>
    )
};
export default UnderlineNavElmt;