import React, { useEffect } from 'react'
import AccessoryIconBronze from 'assets/img/accessory_icon_bronze.png';
import AccessoryIconDiamond from 'assets/img/accessory_icon_diamond.png';
import AccessoryIconGold from 'assets/img/accessory_icon_gold.png';
import AccessoryIconSilver from 'assets/img/accessory_icon_silver.png';
import bouee from 'assets/img/bouee.png';
import hawai from 'assets/img/hawai.png';
import hoodie from 'assets/img/hoodie.png';
import kimono from 'assets/img/kimono.png';
import style from './AccessoriesExamples.module.scss'

export default function AccessoriesExamples() {
    const [accessory, setAccessory] = React.useState(1)
    const [accessoryImg, setAccessoryImg] = React.useState(hawai)
    const [accessoryBg, setAccessoryBg] = React.useState(AccessoryIconBronze)
    const [accessoryName, setAccessoryName] = React.useState('Blue Hawaiian Shirt')
    const [accessoryIcon, setAccessoryIcon] = React.useState(AccessoryIconBronze)
    const [accessoryPrice, setAccessoryPrice] = React.useState('1')

    useEffect(() => {
        switch (accessory) {
            case 1:
                setAccessoryImg(hawai)
                setAccessoryBg(AccessoryIconBronze)
                setAccessoryName('Blue Hawaiian Shirt')
                setAccessoryIcon(AccessoryIconBronze)
                setAccessoryPrice('1')
                break;
            case 2:
                setAccessoryImg(hoodie)
                setAccessoryBg(AccessoryIconSilver)
                setAccessoryName('Black EGLD Hoodie')
                setAccessoryIcon(AccessoryIconSilver)
                setAccessoryPrice('2')
                break;
            case 3:
                setAccessoryImg(kimono)
                setAccessoryBg(AccessoryIconGold)
                setAccessoryName('Kimono With Black Belt')
                setAccessoryIcon(AccessoryIconGold)
                setAccessoryPrice('3')
                break;
            case 4:
                setAccessoryImg(bouee)
                setAccessoryBg(AccessoryIconDiamond)
                setAccessoryName('Duck Buoy')
                setAccessoryIcon(AccessoryIconDiamond)
                setAccessoryPrice('4')
                break; 
        }     
        console.log(accessoryBg);
                  
    }, [accessory])

  return (
    <div className={style['accessories-examples']} >
        <img src={accessoryImg} alt="accessory" />
        <div className={style.info}>
            <p>Clothing Items</p>
            <p>{accessoryName}</p>
        </div>
        <div className={style.reward}>
            <p>{accessoryPrice} APC</p>
            <img src={accessoryIcon} alt="APC icon" />
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
