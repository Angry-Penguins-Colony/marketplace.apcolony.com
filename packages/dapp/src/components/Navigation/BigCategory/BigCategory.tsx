import * as React from 'react';
import { Link } from 'react-router-dom';
import Button from 'components/Abstract/Button/Button';
import style from './BigCategory.module.scss';

export const BigCategory = ({
    title,
    backgroundImg,
    link,
    className = ''
}: {
    title: string;
    backgroundImg: string;
    link: string;
    className?: string;
}) => {
    return (
        <Link to={link} className={style['big-category'] + ' w-100 ' + className}>
            <div >
                <img src={backgroundImg} alt={title} />
                <h2>{title}</h2>
                <Button type='normal' className={style.button}>View all</Button>
            </div>
        </Link>
    );
};
