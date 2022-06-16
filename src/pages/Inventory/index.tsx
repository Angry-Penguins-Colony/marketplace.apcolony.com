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
    const penguinsItems: {
        image: string,
        name: string,
        score?: number,
        added?: string,
    }[] = [
            {
                image: '/Fargerik_bg-overlay.png',
                name: 'Penguin #1',
                score: 6196,
                added: '2019-01-01',
            },
            {
                image: '/Fargerik_bg-overlay.png',
                name: 'Penguin #2',
                score: 946,
                added: '2020-01-01',
            },
            {
                image: '/Fargerik_bg-overlay.png',
                name: 'Penguin #3',
                score: 9814,
                added: '2058-01-01',
            },
            {
                image: '/Fargerik_bg-overlay.png',
                name: 'Penguin #4',
                score: 789,
                added: '2002-01-01',
            },
            {
                image: '/Fargerik_bg-overlay.png',
                name: 'Penguin #5',
                score: 9416,
                added: '2019-01-01',
            },
            {
                image: '/Fargerik_bg-overlay.png',
                name: 'Penguin #6',
                score: 16,
                added: '2019-05-01',
            },
            {
                image: '/Fargerik_bg-overlay.png',
                name: 'Penguin #7',
                score: 49,
                added: '2019-12-01',
            },
            {
                image: '/Fargerik_bg-overlay.png',
                name: 'Penguin #8',
                score: 837,
                added: '2019-07-01',
            },
            {
                image: '/Fargerik_bg-overlay.png',
                name: 'Penguin #9',
                score: 378,
                added: '2019-08-01',
            },
            {
                image: '/Fargerik_bg-overlay.png',
                name: 'Penguin #10',
                score: 3453,
                added: '2019-01-10',
            },
            {
                image: '/Fargerik_bg-overlay.png',
                name: 'Penguin #11',
                score: 387,
                added: '2019-01-15',
            },
            {
                image: '/Fargerik_bg-overlay.png',
                name: 'Penguin #12',
                score: 83,
                added: '2019-01-21',
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
            name: 'Beack #1',
            score: 3453,
            added: '2019-01-10',
        },
        {
            image: '/CGS_Bec Piece EGLD_TK02.png',
            name: 'Beack #2',
            score: 7,
            added: '2020-01-10',
        },
        {
            image: '/CGS_Bec Piece EGLD_TK02.png',
            name: 'Beack #3',
            score: 277,
            added: '2018-01-10',
        },
        {
            image: '/CGS_Bec Piece EGLD_TK02.png',
            name: 'Beack #4',
            score: 9999,
            added: '2010-01-10',
        }
    ];
    // TODO: find a way to sort items when is getting from the api

    const [items, setItems] = React.useState(penguinsItems);
    const [itemsType, setItemsType] = React.useState('penguins');

    function itemsTypeChange(type: string) {
        switch (type) {
            case 'penguins':
                setItems(penguinsItems);
                setItemsType('penguins');
                // sortBy('recently-added');
                break;
            case 'eggs':
                setItems(eggsItems);
                setItemsType('eggs');
                break;
            case 'items':
                setItems(itemsItems);
                setItemsType('items');
                // sortBy('recently-added');
                break;
            default:
                setItems(penguinsItems);
                setItemsType('penguins');
                // sortBy('recently-added');
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

    function sortBy(type: string) {
        console.log(type);
        console.table(items);
        switch (type) {
            case 'recently-added':
                setItems([...items.sort((a, b) => {
                    return new Date(b.added || '1970-01-01').getTime() - new Date(a.added || '1970-01-01').getTime();
                }
                )]);
                break;
            case 'rarity-high-to-low':
                setItems([...items.sort((a, b) => {
                    return (b.score || 0) - (a.score || 0);
                }
                )]);
                break;
            case 'rarity-low-to-high':
                setItems([...items.sort((a, b) => {
                    return (a.score || 0) - (b.score || 0);
                }
                )]);
                break;
            default:
                setItems([...items.sort((a, b) => {
                    return new Date(b.added || '1970-01-01').getTime() - new Date(a.added || '1970-01-01').getTime();
                }
                )]);
                break;
        }
        console.table(items);
    }
    // sortBy('recently-added'); // default sort

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
                    <NavInventory type={itemsType} typeWithFilter={typeWithFilter} sortByFunction={sortBy} />
                </section>
                <ItemsInventory items={items} className={style['items-inventory']} type={itemsType} hasFilter={typeWithFilter.includes(itemsType)} />
            </div>
        </>
    );
};

export default Inventory;
