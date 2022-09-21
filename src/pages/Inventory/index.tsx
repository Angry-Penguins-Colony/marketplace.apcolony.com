import * as React from 'react';
import { useGetAccountInfo } from '@elrondnetwork/dapp-core/hooks';
import { useAccordionButton } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import ShareIcon from 'components/Icons/ShareIcon';
import MobileHeader from 'components/Layout/MobileHeader/MobileHeader';
import { useGetOwnedItems, useGetOwnedPenguins } from 'sdk/hooks/useGetOwned';
import style from './inventory.module.scss';
import ItemsInventory from './ItemsInventory';
import NavigationType from './NavigationType';
import NavInventory from './NavInventory';

const typeWithFilter: string[] = [];

interface IInventoryItem {
    thumbnailCID: string;
    name: string;
    score?: number;
    purchaseDate?: Date;
}

const Inventory = () => {

    const { address: walletAddress } = useParams();
    const { address: connectedAddress } = useGetAccountInfo();

    React.useEffect(() => {
        // add class to body element for no footer
        document.body.classList.add('no-footer');
        document.body.classList.add('no-scroll');
    }, []);


    const [items, setItems] = React.useState<IInventoryItem[] | undefined>(undefined);
    const [itemsType, setItemsType] = React.useState('penguins');

    const penguinsItems = useGetOwnedPenguins({
        onLoaded: setItems
    });
    const itemsItems = useGetOwnedItems();

    function itemsTypeChange(type: string) {
        switch (type) {
            case 'items':
                setItems(itemsItems);
                setItemsType('items');
                break;

            case 'penguins':
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

        if (!items) return;

        switch (type) {
            case 'recently-added':
                setItems([...items.sort((a, b) => {
                    return new Date(b.purchaseDate || '1970-01-01').getTime() - new Date(a.purchaseDate || '1970-01-01').getTime();
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
                    return new Date(b.purchaseDate || '1970-01-01').getTime() - new Date(a.purchaseDate || '1970-01-01').getTime();
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
                    {walletAddress == connectedAddress ?
                        <h2>Your Inventory</h2> :
                        <><br /><br /></>
                    }
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
                            <p className={style.number}>{penguinsItems?.length ?? '-'}</p>
                            <p className={style.name}>Penguins</p>
                        </div>
                        <div className={style.item}>
                            <p className={style.number}>{itemsItems?.length ?? '-'}</p>
                            <p className={style.name}>Items</p>
                        </div>
                    </div>
                    <div className={style.title}>
                        <h3>My {itemsType.charAt(0).toUpperCase() + itemsType.slice(1)}</h3>
                        <span className={style['number-items']}>{items?.length ?? '-'}</span>
                        <p className={style.info}>(Select {addArticle(itemsType.slice(0, -1))} to customize it)</p>
                    </div>
                    <NavInventory type={itemsType} typeWithFilter={typeWithFilter} sortByFunction={sortBy}
                        filterData={filterData} changeFilters={changeFilters} />
                </section>

                {items &&
                    <ItemsInventory items={items} className={style['items-inventory']} type={itemsType} hasFilter={typeWithFilter.includes(itemsType)} filters={filterData} />
                }
            </div>
        </>
    );
};

export default Inventory;
