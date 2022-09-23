import * as React from 'react';
import { useGetAccountInfo } from '@elrondnetwork/dapp-core/hooks';
import { Address } from '@elrondnetwork/erdjs/out';
import { useParams } from 'react-router-dom';
import ShareIcon from 'components/Icons/ShareIcon';
import MobileHeader from 'components/Layout/MobileHeader/MobileHeader';
import { useGetOwnedItems, useGetOwnedPenguins } from 'sdk/hooks/api/useGetOwned';
import useInventoryFilter from 'sdk/hooks/useInventoryFilter';
import style from './index.module.scss';
import ItemsInventory from './ItemsInventory/ItemsInventory';
import NavigationType from './NavigationType/NavigationType';
import NavInventory from './NavInventory/NavInventory';
import { IInventoryItem } from './types/IInventoryItem';

const typeWithFilter: string[] = [];

const Inventory = () => {

    const { address: walletAddress } = useParams();
    const { address: connectedAddress } = useGetAccountInfo();

    if (!walletAddress) throw new Error('Wallet address is required');

    React.useEffect(() => {
        // add class to body element for no footer
        document.body.classList.add('no-footer');
        document.body.classList.add('no-scroll');
    }, []);


    const [items, setItems] = React.useState<IInventoryItem[] | undefined>(undefined);
    const [itemsType, setItemsType] = React.useState('penguins');

    const penguinsItems = useGetOwnedPenguins({
        onLoaded: setItems,
        overrideAddress: Address.fromBech32(walletAddress),
    });
    const itemsItems = useGetOwnedItems({
        overrideAddress: Address.fromBech32(walletAddress)
    });

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

    const {
        sortBy,
        changeFilters,
        filterData
    } = useInventoryFilter(items, setItems);

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
