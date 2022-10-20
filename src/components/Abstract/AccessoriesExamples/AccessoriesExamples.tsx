import React from 'react'
import AccessoryIconBronze from 'assets/img/accessory_icon_bronze.png';
import AccessoryIconDiamond from 'assets/img/accessory_icon_diamond.png';
import AccessoryIconGold from 'assets/img/accessory_icon_gold.png';
import AccessoryIconSilver from 'assets/img/accessory_icon_silver.png';
import kimono from 'assets/img/kimono.png';
import exampleImg from 'assets/img/sell_and_buy_penguin_example.png';
import style from './AccessoriesExamples.module.scss'

export default function AccessoriesExamples() {
    const [accessory, setAccessory] = React.useState(1)

  return (
    <div className={style['accessories-examples']}>
        <img src={kimono} alt="Bronze accessory" className={`${accessory != 1 && style.hidden}`} />
        <img src={exampleImg} alt="Silver accessory" className={`${accessory != 2 && style.hidden}`}/>
        <img src={kimono} alt="Gold accessory" className={`${accessory != 3 && style.hidden}`}/>
        <img src={exampleImg} alt="Diamond accessory" className={`${accessory != 4 && style.hidden}`}/>
        <div className={style.info}>
            <p>Clothing Items</p>
            <p>Kimono white with red belt</p>
        </div>
        <div className={style.menu}>
            <p>
            Choose items rarity
            </p>
            <div className={style['img-container']}>
                <img onClick={() => setAccessory(1)} className={`${accessory == 1 && style.active}`} src={AccessoryIconBronze} alt="Bronze accessory icon" />
                <img onClick={() => setAccessory(2)} className={`${accessory == 2 && style.active}`} src={AccessoryIconSilver} alt="Silver accessory icon" />
                <img onClick={() => setAccessory(3)} className={`${accessory == 3 && style.active}`} src={AccessoryIconGold} alt="Gold accessory icon" />
                <img onClick={() => setAccessory(4)} className={`${accessory == 4 && style.active}`} src={AccessoryIconDiamond} alt="Diamond accessory icon" />
            </div>
        </div>
    </div>
  )
}
