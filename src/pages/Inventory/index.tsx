import * as React from 'react';
import BackIcon from 'components/Icons/BackIcon';
import DiscordIcon from 'components/Icons/DiscordIcon';
import KebabIcon from 'components/Icons/KebabIcon';
import ShareIcon from 'components/Icons/ShareIcon';
import TwitterIcon from 'components/Icons/TwitterIcon';
import style from './inventory.module.scss';
import ItemsInventory from './ItemsInventory';
import NavigationType from './NavigationType';
import NavInventory from './NavInventory';


const typeWithFilter = ['penguins', 'items'];

const Inventory = () => {

    const walletAddress = 'erd10000000000000000000000000000000000000000000000000000000000';

    // get items
    const penguinsItems = [
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
    const eggsItems = [
        {
            image: '/Blue_egg.png',
            name: 'Egg #1'
        },
        {
            image: '/Blue_egg.png',
            name: 'Egg #2'
        },
        {
            image: '/Gold_egg.png',
            name: 'Egg #3'
        },
        {
            image: '/Blue_egg.png',
            name: 'Egg #4'
        }
    ];
    const itemsItems = [
        {
            image: '/CGS_Bec Piece EGLD_TK02.png',
            name: 'Beack #1'
        }
    ];


    const [items, setItems] = React.useState(penguinsItems);
    const [itemsType, setItemsType] = React.useState('penguins');

    function itemsTypeChange(type: string) {
        switch (type) {
            case 'penguins':
                setItems(penguinsItems);
                setItemsType('penguins');
                break;
            case 'eggs':
                setItems(eggsItems);
                setItemsType('eggs');
                break;
            case 'items':
                setItems(itemsItems);
                setItemsType('items');
                break;
            default:
                setItems(penguinsItems);
                setItemsType('penguins');
                break;
        }
    }

    function addArticle(txt: string) {
        const firstLetter = txt.charAt(0).toUpperCase();
        if (firstLetter === 'A' || firstLetter === 'E' || firstLetter === 'I' || firstLetter === 'O' || firstLetter === 'U') {
            return 'an ' + txt;
        } else {
            return 'a ' + txt;
        }
    }

    return (
        <>
            <div id={style['desktop-header']}>
                <header>
                    <div className={style.left}>
                        <img src="/logo.png" alt="Logo Angry Penguins" />
                        <nav>
                            <div className={style.item}>Home</div>
                            <div className={style.item}>Shop</div>
                            <div className={style.item}>My Inventory</div>
                            <div className={style.item}>Customize</div>
                        </nav>
                    </div>
                    <div className={style.right}>
                        <div className={style.social}>
                            <div className={style.twitter + ' ' + style.icon}>
                                <TwitterIcon />
                            </div>
                            <div className={style.discord + ' ' + style.icon}>
                                <DiscordIcon />
                            </div>
                        </div>
                        <div className={style.profile}>
                            <img src="/pingouin emperor.png" alt="Your profile image" />
                        </div>
                    </div>
                </header>
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

                <NavigationType className={style['navigation-type']} onChangeType={itemsTypeChange} itemsType={itemsType} />

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
                        <h3>My {itemsType.charAt(0).toUpperCase() + itemsType.slice(1)}</h3>
                        {/* TODO: Bind this value */}
                        <span className={style['number-items']}>18</span>
                        <p className={style.info}>(Select {addArticle(itemsType.slice(0, -1))} to customize it)</p>
                    </div>
                    <NavInventory type={itemsType} typeWithFilter={typeWithFilter} />
                </section>
                <ItemsInventory items={items} className={style['items-inventory']} type={itemsType} hasFilter={typeWithFilter.includes(itemsType)} />
            </div>
        </>
    );
};

export default Inventory;
