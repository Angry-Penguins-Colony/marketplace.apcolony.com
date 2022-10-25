import * as React from 'react';
import { defaultImages } from 'config';
import style from './PenguinRender.module.scss';

const PenguinRender = (
    {
        items,
        children
    }: {
        items: {
            background?: string,
            hat?: string,
            eyes?: string,
            clothes?: string,
            beak?: string,
            skin?: string,
            weapon?: string
        },
        children?: React.ReactNode
    }
) => {

    return (
        <div className={style.render + (items.background ? ' ' + style.hasBackground : '')}>

            <img src={items.background ?? defaultImages.background} alt="background" className='background' />
            <img src={items.skin ?? defaultImages.skin} alt="skin" className='skin' />


            <img src={items.eyes ?? defaultImages.eyes} alt="eyes" className='eyes' />

            {
                items.weapon && (
                    <img src={items.weapon} alt="weapon" className='weapon' />
                )
            }

            {
                items.clothes && (
                    <img src={items.clothes} alt="clothes" className='clothes' />
                )
            }

            <img src={items.beak ?? defaultImages.beak} alt="beak" className='beak' />

            {
                items.hat && (
                    <img src={items.hat} alt="hat" className='hat' />
                )
            }

            {children}
        </div>);

};

export default PenguinRender;