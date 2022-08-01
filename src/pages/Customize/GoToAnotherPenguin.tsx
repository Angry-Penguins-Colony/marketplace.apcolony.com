import * as React from 'react';
import LeftArrowIcon from 'components/Icons/LeftArrowIcon';
import RightArrowIcon from 'components/Icons/RightArrowIcon';
import style from './go-to-another-penguin.module.scss';

const GoToAnotherPenguin = (
    {
        leftPenguin,
        currentPenguin,
        rightPenguin,
        subTitle,
        className
    }: {
        leftPenguin?: {
            id: string;
            thumbnail: string;
        } | undefined,
        currentPenguin: {
            id: string;
            thumbnail: string;
        },
        rightPenguin?: {
            id: string;
            thumbnail: string;
        } | undefined,
        subTitle: string,
        className?: string
    }
) => {
    function goToLeftPenguin() {
        if (leftPenguin) {
            window.location.href = '/customize/' + leftPenguin.id;
        }
    }

    function goToRightPenguin() {
        if (rightPenguin) {
            window.location.href = '/customize/' + rightPenguin.id;
        }
    }

    // not display comoponent if there is no other penguin
    if (leftPenguin === undefined && rightPenguin === undefined) {
        return null;
    }

    return (
        <div id={style['go-to-another-penguin']} className={className}>
            <h3>Select another penguin</h3>
            <div className={style.content}>
                {
                    leftPenguin && (
                        <div className={style.arrow + ' ' + style.left}>
                            <div className={style.clickable} onClick={goToLeftPenguin}>
                                <LeftArrowIcon />
                            </div>
                        </div>
                    )
                }
                <div className={style['desktop-info']}>
                    <h2>Customize</h2>
                    <p className={style.info}>{subTitle}</p>
                </div>
                <div className={style.penguins}>
                    {
                        leftPenguin && (
                            <div className={style.penguin} onClick={goToLeftPenguin}>
                                <img src={leftPenguin.thumbnail} alt={'Penguin #' + leftPenguin.id} />
                            </div>
                        ) || (
                            <div className={style.penguin + ' ' + style.empty}></div>
                        )
                    }
                    {
                        currentPenguin && (
                            <div className={style.penguin + ' ' + style.current}>
                                <img src={currentPenguin.thumbnail} alt={'Penguin #' + currentPenguin.id} />
                            </div>
                        )
                    }
                    {
                        rightPenguin && (
                            <div className={style.penguin} onClick={goToRightPenguin}>
                                <img src={rightPenguin.thumbnail} alt={'Penguin #' + rightPenguin.id} />
                            </div>
                        ) || (
                            <div className={style.penguin + ' ' + style.empty}></div>
                        )
                    }
                </div>
                {
                    rightPenguin && (
                        <div className={style.arrow + ' ' + style.right}>
                            <div className={style.clickable} onClick={goToRightPenguin}>
                                <RightArrowIcon />
                            </div>
                        </div>
                    )
                }
            </div>
        </div>
    );

};

export default GoToAnotherPenguin;