import * as React from 'react';
import defaultPenguinImg from './../../assets/img/penguin_default.png';
import style from './penguin-render.module.scss';

const PenguinRender = (
    {
        items
    }: {
        items: {
            background?: string,
            hat?: string,
            eyes?: string,
            clothes?: string,
            beak?: string,
            skin?: string,
            weapon?: string
        }
    }
) => {
    return (
        <div className={style.render + (items.background ? ' ' + style.hasBackground : '')}>
            {
                items.background && (
                    <img src={items.background} alt="background" className='background' />
                )
            }
            <img src={defaultPenguinImg} alt="default" className='default' />
            {
                items.skin && (
                    <img src={items.skin} alt="skin" className='skin' />
                )
            }
            {
                items.hat && (
                    <img src={items.hat} alt="hat" className='hat' />
                )
            }
            {
                items.eyes && (
                    <img src={items.eyes} alt="eyes" className='eyes' />
                )
            }
            {
                items.clothes && (
                    <img src={items.clothes} alt="clothes" className='clothes' />
                )
            }
            {
                items.beak && (
                    <img src={items.beak} alt="beak" className='beak' />
                )
            }
            {
                items.weapon && (
                    <img src={items.hat} alt="weapon" className='weapon' />
                )
            }
        </div>);

};

export default PenguinRender;