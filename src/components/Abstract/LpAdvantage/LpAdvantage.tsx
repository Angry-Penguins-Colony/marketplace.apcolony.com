import React from 'react'
import style from './LpAdvantage.module.scss';

const LpAdvantage = ({
    children,
    mainText,
    subText,
    img,
    imgStyle
}: {
    children?: React.ReactNode,
    mainText: string,
    subText: string,
    img:string,
    imgStyle:React.CSSProperties
}) => {
  return (
    <>
        <div className={style.advantage}>
            <div>
              <p>{mainText}</p>
              <p>{subText}</p>
              {children}
            </div>
            <div>
              <img style={imgStyle}  className={style.img} src={img} alt="Lanchpad avantage" />
            </div>
        </div>
        <br />
    </>
  )
}

export default LpAdvantage;