import React from 'react'
import style from './AccessoriesGeneration.module.scss'

export default function AccessoriesGeneration({
    rarity,
    tokenGenerated,
    img,
}: {
    rarity: string,
    tokenGenerated: number,
    img: string,
}) {
  return (
    <div className={style['accessory-generation']}>
        <div className={style.info}>
            <div>
                {rarity} ACCESSORIES GENERATE
            </div>
            <div>
                {tokenGenerated} TOKENS
            </div>
        </div>
        <div className={style['img-container']}>
            <img src={img} alt="Accessory level" />
        </div>
    </div>
  )
}
