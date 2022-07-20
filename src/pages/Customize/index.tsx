import * as React from 'react';
import { useParams } from 'react-router-dom';
import Button from 'components/Button/Button';
import RefreshIcon from 'components/Icons/RefreshIcon';
import MobileHeader from 'components/Layout/MobileHeader/MobileHeader';
import tmpImgBackground from './../../assets/img/penguin_background.png';
import style from './customize.module.scss';
import PenguinRender from './Render';

// TODO bind with real function
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

interface PenguinItems {
    background?: string;
    hat?: string;
    eyes?: string;
    clothes?: string;
    beak?: string;
    skin?: string;
    weapon?: string;
}


const Customize = () => {
    const { id } = useParams();
    const penguinData = getMyPenguinData(id);

    const [penguinItems, setPenguinItems] = React.useState<PenguinItems>({});

    React.useEffect(() => {
        setTimeout(() => { // simulate server call TODO: add api call
            setPenguinItems({
                background: tmpImgBackground,
            });
        }, 900);
    }, []);

    function resetItems() {
        console.log('reset items');
        setPenguinItems({});
    }

    function cancelAll() {
        // TODO: cancel all
        console.log('cancel all');
    }

    function saveCustomization() {
        // TODO: save customization
        console.log('save customization');
    }

    function addItem(itemType: string, itemSrc: string | undefined) {
        // add item
        const newItems = {
            ...penguinItems,
            [itemType]: itemSrc
        };
        setPenguinItems(newItems);
    }

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
                    <PenguinRender items={penguinItems} />
                    <div className={style.items}>
                        <div className={style.item + ' ' + style.beak}></div>
                        <div className={style.item + ' ' + style.skin}></div>
                        <div className={style.item + ' ' + style.weapon}></div>
                        <div className={style.item + ' ' + style.background}></div>
                    </div>
                </div>
                <div className={style.reset}>
                    <Button icon={<RefreshIcon />}>Reset Items</Button>
                </div>
                <div className={style.controls}>
                    <Button type='cancel'>Cancel All</Button>
                    <Button type='primary'>Confirm Customization</Button>
                </div>
            </section>
        </>
    );
};

export default Customize;