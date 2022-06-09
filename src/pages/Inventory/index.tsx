import * as React from 'react';
import BackIcon from 'components/Icons/BackIcon';
import KebabIcon from 'components/Icons/KebabIcon';
import ShareIcon from 'components/Icons/ShareIcon';
import style from './inventory.module.scss';
import ItemsInventory from './ItemsInventory';
import NavigationType from './NavigationType';
import NavInventory from './NavInventory';

const Inventory = () => {

    const walletAddress = 'erd10000000000000000000000000000000000000000000000000000000000';

    // get items
    const items = [
        {
            image: '/Fargerik_bg-overlay.png',
            name: 'Penguin #1'
        },
        {
            image: '/Fargerik_bg-overlay.png',
            name: 'Penguin #2'
        },
        {
            image: '/Fargerik_bg-overlay.png',
            name: 'Penguin #3'
        },
        {
            image: '/Fargerik_bg-overlay.png',
            name: 'Penguin #4'
        },
        {
            image: '/Fargerik_bg-overlay.png',
            name: 'Penguin #5'
        },
        {
            image: '/Fargerik_bg-overlay.png',
            name: 'Penguin #6'
        },
        {
            image: '/Fargerik_bg-overlay.png',
            name: 'Penguin #7'
        },
        {
            image: '/Fargerik_bg-overlay.png',
            name: 'Penguin #8'
        },
        {
            image: '/Fargerik_bg-overlay.png',
            name: 'Penguin #9'
        },
        {
            image: '/Fargerik_bg-overlay.png',
            name: 'Penguin #10'
        },
        {
            image: '/Fargerik_bg-overlay.png',
            name: 'Penguin #11'
        },
        {
            image: '/Fargerik_bg-overlay.png',
            name: 'Penguin #12'
        }
    ];

    return (
        <>
            <div id={style['desktop-header']}>

            </div>
            <div id={style['mobile-header']}>
                <BackIcon className={style.icon} />
                <h1>My Inventory</h1>
                <KebabIcon className={style.icon} />
            </div>
            <div id={style['body-content']}>
                <header>
                    <h2>Pseudonyme</h2>
                    <p className={style['wallet-address']}>
                        <span>{walletAddress}</span>
                        <div className={style.share} onClick={
                            () => {
                                navigator.share({
                                    title: document.title,
                                    text: walletAddress,
                                    url: window.location.href
                                });
                            }
                        }>
                            <ShareIcon className={style.icon} />
                        </div>
                    </p>
                </header>

                <NavigationType className={style['navigation-type']} />

                <section id={style.filter}>
                    <div className={style['number-items']}>
                        <div className={style.item}>
                            <p className={style.number}>12</p>
                            <p className={style.name}>Penguins</p>
                        </div>
                        <div className={style.item}>
                            <p className={style.number}>5</p>
                            <p className={style.name}>Eggs</p>
                        </div>
                        <div className={style.item}>
                            <p className={style.number}>45</p>
                            <p className={style.name}>Items</p>
                        </div>
                        <div className={style.item}>
                            <p className={style.number}>2</p>
                            <p className={style.name}>Sold</p>
                        </div>
                    </div>
                    <div className={style.title}>
                        <h3>My Penguins</h3>
                        {/* TODO: Bind this value */}
                        <span className={style['number-items']}>18</span>
                        <p className={style.info}>(Select a penguin to customize it)</p>
                    </div>
                    <NavInventory />
                </section>
                <ItemsInventory items={items} className={style['items-inventory']} title={'My Penguins'} />
            </div>
        </>
    );
};

export default Inventory;
