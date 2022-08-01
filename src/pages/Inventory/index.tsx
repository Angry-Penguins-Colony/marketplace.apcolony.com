import * as React from 'react';
import EditIcon from 'components/Icons/EditIcon';
import ShareIcon from 'components/Icons/ShareIcon';
import MobileHeader from 'components/Layout/MobileHeader/MobileHeader';
import style from './inventory.module.scss';
import ItemsInventory from './ItemsInventory';
import NavigationType from './NavigationType';
import NavInventory from './NavInventory';

const typeWithFilter = ['penguins'];

const Inventory = () => {

    const walletAddress = 'erd10000000000000000000000000000000000000000000000000000000000';

    // get items
    const penguinsItems: {
        image: string,
        name: string,
        score?: number,
        added?: string,
        attributes?: {
            traitType: string,
            value: string
        }[]
    }[] = [
            {
                image: 'https://media.elrond.com/nfts/asset/QmW8g9GXXZR1JhDW7XNMybyRrWqWiUHa1N26DEYSoFwxMc',
                name: 'Penguin #4987',
                score: 5464,
                added: '2019-01-01',
                attributes: [
                    {
                        traitType: 'background',
                        value: 'Blue Gradient'
                    },
                    {
                        traitType: 'beak',
                        value: 'Straw'
                    },
                    {
                        traitType: 'clothes',
                        value: 'Coat With Brown Fur'
                    },
                    {
                        traitType: 'hat',
                        value: 'Blue Bitcoin Cap'
                    },
                    {
                        traitType: 'skin',
                        value: 'Claw Marks'
                    },
                    {
                        traitType: 'weapon',
                        value: 'Snowboard'
                    }
                ]
            },
            {
                image: 'https://media.elrond.com/nfts/asset/QmSLvDdsZ9GPC9VcvdGdfSbRVvxoMwfMdXPgmWeafzbMgy',
                name: 'Penguin #1155',
                score: 177,
                added: '2020-01-01',
                attributes: [
                    {
                        traitType: 'background',
                        value: 'Dark Blue'
                    },
                    {
                        traitType: 'eyes',
                        value: 'Black'
                    },
                    {
                        traitType: 'skin',
                        value: 'Black'
                    },
                    {
                        traitType: 'weapon',
                        value: 'Fishing Rifle'
                    }
                ]
            },
            {
                image: 'https://media.elrond.com/nfts/asset/QmXMKmMguQFhXqx7qdCLnDhB9AFhyFYpMmBPMyHBqc2w8p',
                name: 'Penguin #4782',
                score: 9814,
                added: '2058-01-01',
                attributes: [
                    {
                        traitType: 'background',
                        value: 'Red',
                    },
                    {
                        traitType: 'beak',
                        value: 'Pipe',
                    },
                    {
                        traitType: 'clothes',
                        value: 'Red Lifejacket',
                    },
                    {
                        traitType: 'eyes',
                        value: 'Red',
                    },
                    {
                        traitType: 'skin',
                        value: 'Light Frozen',
                    },
                    {
                        traitType: 'weapon',
                        value: 'Axe',
                    }
                ]
            },
            {
                image: '/img/Fargerik_bg-overlay.png',
                name: 'Penguin #4',
                score: 789,
                added: '2002-01-01',
            },
            {
                image: '/img/Fargerik_bg-overlay.png',
                name: 'Penguin #5',
                score: 9416,
                added: '2019-01-01',
            },
            {
                image: '/img/Fargerik_bg-overlay.png',
                name: 'Penguin #6',
                score: 16,
                added: '2019-05-01',
            },
            {
                image: '/img/Fargerik_bg-overlay.png',
                name: 'Penguin #7',
                score: 49,
                added: '2019-12-01',
            },
            {
                image: '/img/Fargerik_bg-overlay.png',
                name: 'Penguin #8',
                score: 837,
                added: '2019-07-01',
            },
            {
                image: '/img/Fargerik_bg-overlay.png',
                name: 'Penguin #9',
                score: 378,
                added: '2019-08-01',
            },
            {
                image: '/img/Fargerik_bg-overlay.png',
                name: 'Penguin #10',
                score: 3453,
                added: '2019-01-10',
            },
            {
                image: '/img/Fargerik_bg-overlay.png',
                name: 'Penguin #11',
                score: 387,
                added: '2019-01-15',
            },
            {
                image: '/img/Fargerik_bg-overlay.png',
                name: 'Penguin #12',
                score: 83,
                added: '2019-01-21',
            }
        ];
    const eggsItems = [
        {
            image: '/img/eggs/Blue_egg.png',
            name: 'Egg #1'
        },
        {
            image: '/img/eggs/Blue_egg.png',
            name: 'Egg #2'
        },
        {
            image: '/img/eggs/Gold_egg.png',
            name: 'Egg #3'
        },
        {
            image: '/img/eggs/Blue_egg.png',
            name: 'Egg #4'
        }
    ];
    const itemsItems = [
        {
            image: '/img/items/CGS_Bec Piece EGLD_TK02.png',
            name: 'Beak #1',
            score: 3453,
            added: '2019-01-10',
        },
        {
            image: '/img/items/CGS_Bec Piece EGLD_TK02.png',
            name: 'Beak #2',
            score: 7,
            added: '2020-01-10',
        },
        {
            image: '/img/items/CGS_Bec Piece EGLD_TK02.png',
            name: 'Beak #3',
            score: 277,
            added: '2018-01-10',
        },
        {
            image: '/img/items/CGS_Bec Piece EGLD_TK02.png',
            name: 'Beak #4',
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

    function sortBy(type: string) {
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

    // TODO: number of items per attribute
    const [filterData, setFilterData] = React.useState({
        items: [
            {
                title: 'Background',
                value: 'background',
                icon: '/img/icon/background_icon.png',
                attributes: [
                    {
                        name: 'Blue Gradient',
                        number: 150,
                        value: 'blue-gradient',
                        isSelected: false,
                        isTmpSelected: false,
                    },
                    {
                        name: 'Dark Blue',
                        number: 75,
                        value: 'dark-blue',
                        isSelected: false,
                        isTmpSelected: false,
                    },
                    {
                        name: 'Red',
                        number: 135,
                        value: 'red',
                        isSelected: false,
                        isTmpSelected: false,
                    }
                ]
            },
            {
                title: 'Hat',
                value: 'hat',
                icon: '/img/icon/hat_icon.png',
                attributes: [
                    {
                        name: 'Blue Bitcoin Cap',
                        number: 150,
                        value: 'blue-bitcoin-cap',
                        isSelected: false,
                        isTmpSelected: false,
                    }
                ]
            },
            {
                title: 'Eyes',
                value: 'eyes',
                icon: '/img/icon/eyes_icon.png',
                attributes: [
                    {
                        name: 'Blue',
                        number: 150,
                        value: 'hat-blue',
                        isSelected: false,
                        isTmpSelected: false,
                    },
                    {
                        name: 'Red',
                        number: 75,
                        value: 'hat-red',
                        isSelected: false,
                        isTmpSelected: false,
                    },
                    {
                        name: 'Yellow',
                        number: 135,
                        value: 'hat-yellow',
                        isSelected: false,
                        isTmpSelected: false,
                    }
                ]
            },
            {
                title: 'Beak',
                value: 'beak',
                icon: '/img/icon/beak_icon.png',
                attributes: [
                    {
                        name: 'Straw',
                        number: 150,
                        value: 'straw',
                        isSelected: false,
                        isTmpSelected: false,
                    },
                    {
                        name: 'Pipe',
                        number: 75,
                        value: 'pipe',
                        isSelected: false,
                        isTmpSelected: false,
                    }
                ]
            },
            {
                title: 'Clothes',
                value: 'clothes',
                icon: '/img/icon/clothes_icon.png',
                attributes: [
                    {
                        name: 'Coat With Brown Fur',
                        number: 150,
                        value: 'coat-with-brown-fur',
                        isSelected: false,
                        isTmpSelected: false,
                    },
                    {
                        name: 'Red Lifejacket',
                        number: 75,
                        value: 'red-lifejacket',
                        isSelected: false,
                        isTmpSelected: false,
                    }
                ]
            },
            {
                title: 'Weapons',
                value: 'weapons',
                icon: '/img/icon/weapons_icon.png',
                attributes: [
                    {
                        name: 'Snowboard',
                        number: 150,
                        value: 'snowboard',
                        isSelected: false,
                        isTmpSelected: false,
                    },
                    {
                        name: 'Fishing Rifle',
                        number: 75,
                        value: 'fishing-rifle',
                        isSelected: false,
                        isTmpSelected: false,
                    },
                    {
                        name: 'Axe',
                        number: 135,
                        value: 'axe',
                        isSelected: false,
                        isTmpSelected: false,
                    }
                ]
            },
            {
                title: 'Skin',
                value: 'skin',
                icon: '/img/icon/skin_icon.png',
                attributes: [
                    {
                        name: 'Claw Marks',
                        number: 150,
                        value: 'claw-marks',
                        isSelected: false,
                        isTmpSelected: false,
                    },
                    {
                        name: 'Black',
                        number: 75,
                        value: 'black',
                        isSelected: false,
                        isTmpSelected: false,
                    },
                    {
                        name: 'Light Frozen',
                        number: 135,
                        value: 'light-frozen',
                        isSelected: false,
                        isTmpSelected: false,
                    }
                ]
            }
        ],
        selected: []
    });


    function changeFilters(newFilterData: any) {
        setFilterData({
            ...newFilterData,
            selected: newFilterData.items.map((item:
                {
                    title: string;
                    value: string;
                    icon: string;
                    attributes: {
                        name: string;
                        number: number;
                        value: string;
                        isSelected: boolean;
                        isTmpSelected: boolean;
                    }[];
                }) => {
                const number = item.attributes.filter((attr: { isSelected: boolean; }) => attr.isSelected).length;

                if (number > 0) {
                    return {
                        name: item.title,
                        value: item.value,
                        number: number
                    };
                } else {
                    return null;
                }
            }).filter((item: any) => item !== null)
        });
    }

    return (
        <>
            <MobileHeader title="My Inventory" className={style['mobile-header']} />
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

                <div className={style['edit-background']}>
                    <div className={style.content} onClick={
                        () => {
                            // TODO: add edit action
                        }
                    }>
                        <p>edit background</p>
                        <EditIcon className={style.icon} />
                    </div>
                </div>

                <NavigationType className={style['navigation-type']} onChangeType={itemsTypeChange} itemsType={itemsType} />

                <section id={style.filter}>
                    <div className={style['number-items']}>
                        <div className={style.item}>
                            <p className={style.number}>{penguinsItems.length}</p>
                            <p className={style.name}>Penguins</p>
                        </div>
                        <div className={style.item}>
                            <p className={style.number}>{eggsItems.length}</p>
                            <p className={style.name}>Eggs</p>
                        </div>
                        <div className={style.item}>
                            <p className={style.number}>{itemsItems.length}</p>
                            <p className={style.name}>Items</p>
                        </div>
                        <div className={style.item}>
                            <p className={style.number}>?</p>
                            <p className={style.name}>Sold</p>
                        </div>
                    </div>
                    <div className={style.title}>
                        <h3>My {itemsType.charAt(0).toUpperCase() + itemsType.slice(1)}</h3>
                        {/* TODO: Bind this value */}
                        <span className={style['number-items']}>18</span>
                        <p className={style.info}>(Select {addArticle(itemsType.slice(0, -1))} to customize it)</p>
                    </div>
                    <NavInventory type={itemsType} typeWithFilter={typeWithFilter} sortByFunction={sortBy}
                        filterData={filterData} changeFilters={changeFilters} />
                </section>
                <ItemsInventory items={items} className={style['items-inventory']} type={itemsType} hasFilter={typeWithFilter.includes(itemsType)} filters={filterData} />
            </div>
        </>
    );
};

export default Inventory;
