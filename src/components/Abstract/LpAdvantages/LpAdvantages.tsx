import React from 'react'
import Button from '../Button/Button';
import style from './LpAdvantages.module.scss';

const LpAdvantages = ({
    children,
    mainText,
    subText,
    img
}: {
    children?: React.ReactNode,
    mainText: string,
    subText: string,
    img:string
}) => {
  return (
    <>
        <div className={style.advantage}>
            <p>{mainText}</p>
            <p>{subText}</p>
            {children}
            <img src={img} alt="Lanchpad avantage" />
        </div>
        <br />
    </>
  )
}

export default LpAdvantages;