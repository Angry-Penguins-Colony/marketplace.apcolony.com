import * as React from 'react';
import Button from 'components/Abstract/Button/Button';
import style from './BigCategory.module.scss';

export const BigCategory = ({
    title,
    backgroundImg,
    link
}: {
    title: string;
    backgroundImg: string;
    link: string;
}) => {
    return (
        <div className={style['big-category'] + ' w-100'} onClick={() => { window.location.href = link; }}>
            <img src={backgroundImg} alt={title} />
            <h2>{title}</h2>
            <Button type='normal' onClick={() => { window.location.href = link; }} className={style.button}>View all</Button>
        </div>
    );
};
