import React from 'react'
import style from './LpAdvantage.module.scss';

const LpAdvantage = ({
    children,
    mainText,
    subText,
    img,
    className
}: {
    children?: React.ReactNode,
    mainText: string,
    subText: string,
    img:string,
    className: string
}) => {
  return (
    <>
        <div className={style.advantage + ' ' + style[className]}>
            <div>
              <p>{mainText}</p>
              <p>{subText}</p>
              {children}
            </div>
            <div>
              <img className={style.img2} src={img} alt="Lanchpad avantage" />
            </div>
        </div>
        <br />
    </>
  )
}

export default LpAdvantage;