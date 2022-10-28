import * as React from 'react';
import { defaultImages, getBadgeUri } from 'config';
import style from './PenguinRender.module.scss';

const PenguinRender = (
    {
        items,
        children,
        badge
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
        badge: number,
        children?: React.ReactNode
    }
) => {

    if (isNaN(badge)) {
        throw new Error('Invalid badge id');
    }

    return (
        <div className={style.render + (items.background ? ' ' + style.hasBackground : '')}>

            <img src={items.background ?? defaultImages.background} alt="background" className='background' />
            {items.skin ?
                (
                    <img src={items.skin} alt="skin" className='skin' />
                )
                : (
                    <>
                        <img src={defaultImages.skin} alt="skin" className='skin' />
                        <img src={getBadgeUri(badge)} alt="badge" />
                    </>
                )}



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