import * as React from 'react';
import { IPenguin } from '@apcolony/marketplace-api';
import style from './index.module.scss';

const PenguinCustomizeHeader = (
    {
        currentPenguin,
        subTitle,
        className = ' '
    }: {
        currentPenguin: IPenguin,
        subTitle: string,
        className?: string
    }
) => {

    return (
        <div className={className + ' ' + style['go-to-another-penguin']}>
            <div className={style.content}>
                <div className={style['desktop-info']}>
                    <h2>Customize</h2>
                    <p className={style.info}>{subTitle}</p>
                </div>
                <div className={style.penguins}>

                    <div className={style.penguin + ' ' + style.current}>
                        <img src={currentPenguin.thumbnailUrls.small} alt={currentPenguin.displayName} />
                    </div>

                </div>
            </div>
        </div>
    );
};

export default PenguinCustomizeHeader;