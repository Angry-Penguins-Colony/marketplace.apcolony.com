import * as React from 'react';
import Button from 'components/Button/Button';
import style from './CategoryItem.module.scss';

export const CategoryItem = ({
    title, img, link }: {
        title: string;
        img: string;
        link: string;
    }) => {
    return (
        <a className={style['category-item']} href={link}>
            <div className={style.right}>
                <h3>{title}</h3>
                <Button type='primary' className={style.button}>View category</Button>
            </div>
            <div className={style.left}>
                <img src={img} alt={title + ' item'} />
            </div>
        </a>
    );
};
