import * as React from 'react';
import { Link } from 'react-router-dom';
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
        <Link to={link} className={style['big-category'] + ' w-100'}>
            <div >
                <img src={backgroundImg} alt={title} />
                <h2>{title}</h2>
                <Link to={link}>
                    <Button type='normal' link={link} className={style.button}>View all</Button>
                </Link>
            </div>
        </Link>
    );
};
