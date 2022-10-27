import * as React from 'react';
import { IGenericElement } from '@apcolony/marketplace-api';
import { useGetAccountInfo } from '@elrondnetwork/dapp-core/hooks';
import { Address } from '@elrondnetwork/erdjs/out';
import { useParams } from 'react-router-dom';
import AddressWrapper from 'components/AddressWrapper';
import ShareIcon from 'components/Icons/ShareIcon';
import ItemsInventory from 'components/Inventory/ItemsInventory/ItemsInventory';
import NavigationType from 'components/Inventory/NavigationType/NavigationType';
import NavInventory from 'components/Inventory/NavInventory/NavInventory';
import MobileHeader from 'components/Layout/MobileHeader/MobileHeader';
import { useGetOwnedAndOnSaleItems } from 'sdk/hooks/api/useGetOwnedAndOnSaleItems';
import { useGetOwnedAndOnSalePenguins } from 'sdk/hooks/api/useGetOwnedAndOnSalePenguins';
import useGetUserOwnedAmount from 'sdk/hooks/api/useGetUserOwnedAmount';
import useInventoryFilter from 'sdk/hooks/useInventoryFilter';
import CategoriesType from 'sdk/types/CategoriesType';
import style from './index.module.scss';

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


    const [inventoryElements, setElements] = React.useState<IGenericElement[] | undefined>(undefined);
    const [inventoryType, setInventoryType] = React.useState<CategoriesType>('penguins');

    const ownedAmount = useGetUserOwnedAmount();
    const penguins = useGetOwnedAndOnSalePenguins(Address.fromBech32(walletAddress));
    const items = useGetOwnedAndOnSaleItems(Address.fromBech32(walletAddress));

    function onChangeType(type: string) {
        switch (type) {
            case 'items':
                setElements(items);
                setInventoryType('items');
                break;

            case 'penguins':
            default:
                setElements(penguins);
                setInventoryType('penguins');
                break;
        }
    }

    React.useEffect(() => {
        onChangeType(inventoryType); items
    }, [penguins, items]);

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
    } = useInventoryFilter(inventoryElements, () => { /* setItems is disabled for the moment */ });

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
                        <span>
                            <AddressWrapper bech32={walletAddress} withLink={false} />
                        </span>
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

                <NavigationType className={style['navigation-type']} onChangeType={onChangeType} itemsType={inventoryType} />

                <section id={style.filter}>
                    <div className={style['number-items']}>
                        <div className={style.item}>
                            <p className={style.number}>{penguins?.length ?? '-'}</p>
                            <p className={style.name}>Penguins</p>
                        </div>
                        <div className={style.item}>
                            <p className={style.number}>{items?.length ?? '-'}</p>
                            <p className={style.name}>Items</p>
                        </div>
                    </div>
                    <div className={style.title}>
                        <h3>My {inventoryType.charAt(0).toUpperCase() + inventoryType.slice(1)}</h3>
                        <span className={style['number-items']}>{inventoryElements?.length ?? '-'}</span>
                        <p className={style.info}>(Select {addArticle(inventoryType.slice(0, -1))} to customize it)</p>
                    </div>
                    <NavInventory type={inventoryType} typeWithFilter={typeWithFilter} sortByFunction={sortBy}
                        filterData={filterData} changeFilters={changeFilters} />
                </section>


                <ItemsInventory
                    className={style['items-inventory']}
                    items={inventoryElements}
                    title={'My ' + inventoryType}
                    type={inventoryType}
                    amountById={ownedAmount ? ownedAmount[inventoryType] : {}}
                    hasFilter={typeWithFilter.includes(inventoryType)}
                    filters={filterData} />
            </div>
        </>
    );
};

export default Inventory;
