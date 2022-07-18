import * as React from 'react';
import { useParams } from 'react-router-dom';
import MobileHeader from 'components/Layout/MobileHeader/MobileHeader';
import tmpImgBackground from './../../assets/img/penguin_background.png';
import style from './customize.module.scss';
import PenguinRender from './Render';

// bind with real function
function getMyPenguinData(id: string | undefined) {
    if (id === undefined) {
        // TODO: found first penguin of user
        id = '????';
    }

    return {
        id,
        // add more data
    };
}

const Customize = () => {
    const { id } = useParams();
    const penguinData = getMyPenguinData(id);

    return (
        <>
            <MobileHeader title="Customize" subTitle={'Penguin #' + penguinData.id} />
            <section className={style.customize}>
                <div className={style.content}>
                    <div className={style.items}>
                        <div className={style.item + ' ' + style.hat}></div>
                        <div className={style.item + ' ' + style.eyes}></div>
                        <div className={style.item + ' ' + style.clothes}></div>
                    </div>
                    <PenguinRender items={{
                        background: tmpImgBackground,
                    }} />
                    <div className={style.items}>
                        <div className={style.item + ' ' + style.beak}></div>
                        <div className={style.item + ' ' + style.skin}></div>
                        <div className={style.item + ' ' + style.weapon}></div>
                        <div className={style.item + ' ' + style.background}></div>
                    </div>
                </div>
                <div className={style.reset}>
                    <button>
                        <span>Reset Items</span>
                    </button>
                </div>
                <div className={style.controls}>
                    <button>Cancel All</button>
                    <button>Confirm Customization</button>
                </div>
            </section>
        </>
    );
};

export default Customize;