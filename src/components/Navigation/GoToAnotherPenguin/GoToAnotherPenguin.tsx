import * as React from 'react';
import { IPenguin } from '@apcolony/marketplace-api';
import LeftArrowIcon from 'components/Icons/LeftArrowIcon';
import RightArrowIcon from 'components/Icons/RightArrowIcon';
import { ipfsGateway } from 'config';
import style from './GoToAnotherPenguin.module.scss';

const GoToAnotherPenguin = (
    {
        selectedPenguinNonce,
        penguins,
        subTitle,
        className
    }: {
        selectedPenguinNonce: number,
        penguins: IPenguin[],
        subTitle: string,
        className?: string
    }
) => {

    const leftPenguin = getPreviousPenguin();
    const rightPenguin = getNextPenguin();
    const currentPenguin = penguins[getCurrentPenguinIndex()];

    function goToLeftPenguin() {
        if (leftPenguin) {
            window.location.href = '/customize/' + leftPenguin.nonce;
        }
    }

    function goToRightPenguin() {
        if (rightPenguin) {
            window.location.href = '/customize/' + rightPenguin.nonce;
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
                                <img src={ipfsGateway + leftPenguin.thumbnailCID} alt={'Penguin #' + leftPenguin.nonce} />
                            </div>
                        ) || (
                            <div className={style.penguin + ' ' + style.empty}></div>
                        )
                    }
                    {
                        currentPenguin && (
                            <div className={style.penguin + ' ' + style.current}>
                                <img src={ipfsGateway + currentPenguin.thumbnailCID} alt={'Penguin #' + currentPenguin.nonce} />
                            </div>
                        )
                    }
                    {
                        rightPenguin && (
                            <div className={style.penguin} onClick={goToRightPenguin}>
                                <img src={ipfsGateway + rightPenguin.thumbnailCID} alt={'Penguin #' + rightPenguin.nonce} />
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

    function getCurrentPenguinIndex() {
        if (!penguins) throw new Error('penguins is undefined');

        return penguins.findIndex((penguin) => penguin.nonce === selectedPenguinNonce);
    }

    function getPreviousPenguin() {
        if (!penguins) throw new Error('penguins is undefined');

        const currentPenguinIndex = getCurrentPenguinIndex();

        if (penguins.length <= 1) {
            return undefined;
        }
        else if (currentPenguinIndex === 0) {
            return penguins[penguins.length - 1];
        } else {
            return penguins[currentPenguinIndex - 1];
        }
    }

    function getNextPenguin() {
        if (!penguins) throw new Error('penguins is undefined');

        const currentPenguinIndex = getCurrentPenguinIndex();

        if (penguins.length <= 1) {
            return undefined;
        }
        else if (currentPenguinIndex === penguins.length - 1) {
            return penguins[0];
        } else {
            return penguins[currentPenguinIndex + 1];
        }
    }
};

export default GoToAnotherPenguin;