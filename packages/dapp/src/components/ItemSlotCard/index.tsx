import React from 'react';
import { Link } from 'react-router-dom';
import Button from 'components/Abstract/Button/Button';
import style from './index.module.scss';

export interface IItemSlotCardProps {
    icon: string;
    link: string;
    title: string;
    className?: string;
}

const ItemSlotCard = ({ icon, link, title, className = '' }: IItemSlotCardProps) => {
    return <Link to={link} className={style.link}>
        <div className={style['item-slot-card'] + ' ' + className}>
            <div>
                <p className={style.title}>{title}</p>
                {/* <div className={style.icon}> */}
                <div className={style.icon}>
                    <img src={icon} alt={title} />
                </div>
                {/* </div> */}
                <Button className={style.button}>
                    View all
                </Button>
            </div>
        </div>
    </Link >
}

export default ItemSlotCard;