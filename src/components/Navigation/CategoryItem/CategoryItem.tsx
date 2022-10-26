import * as React from 'react';
import Button from 'components/Abstract/Button/Button';
import style from './CategoryItem.module.scss';

export const CategoryItem = ({
    title, img, link, className = '' }: {
        title: string;
        img: string;
        link: string;
        className?: string;
    }) => {
    return (
        <a className={style['category-item'] + ' ' + className} href={link}>
            <div className={style.right}>
                <h3>{title}</h3>
                <Button type='primary' className={style.button}>View category</Button>
            </div>
            <div className={style.left}>
                <img src={img} alt={title + ' item'} className={style.image} />
            </div>
        </a>
    );
};
