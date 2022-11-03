import * as React from 'react';
import { useGetAccountInfo } from '@elrondnetwork/dapp-core/hooks';
import { useParams } from 'react-router-dom';
import AddressWrapper from 'components/AddressWrapper';
import ShareIcon from 'components/Icons/ShareIcon';
import ItemsInventory from 'components/Inventory/ItemsInventory/ItemsInventory';
import NavigationType from 'components/Inventory/NavigationType/NavigationType';
import NavInventory from 'components/Inventory/NavInventory/NavInventory';
import MobileHeader from 'components/Layout/MobileHeader/MobileHeader';
import useGetInventory from 'sdk/hooks/pages/useGetInventory';
import useInventoryFilter from 'sdk/hooks/useInventoryFilter';
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

    const {
        inventoryType,
        inventoryElements,
        inventoryOffers,
        penguinsCount,
        itemsCount,
        setInventoryType
    } = useGetInventory(walletAddress);

    const {
        sortBy,
        changeFilters,
        filterData
    } = useInventoryFilter(inventoryElements, () => { /* setItems is disabled for the moment */ });


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
            <MobileHeader title="My Inventory" className={style['mobile-header']} />
            <div id={style['body-content']}>
                <header>
                    {walletAddress == connectedAddress ?
                        <h2>Your Inventory</h2> :
                        <><br /><br /></>
                    }
                    <div className={style['wallet-address']}>
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
                    </div>
                </header>

                <NavigationType className={style['navigation-type']} onChangeType={setInventoryType} itemsType={inventoryType} />

                <section id={style.filter}>
                    <div className={style['number-items']}>
                        <div className={style.item}>
                            <p className={style.number}>{penguinsCount ?? '-'}</p>
                            <p className={style.name}>Penguins</p>
                        </div>
                        <div className={style.item}>
                            <p className={style.number}>{itemsCount ?? '-'}</p>
                            <p className={style.name}>Items</p>
                        </div>
                    </div>
                    <div className={style.title}>
                        <h3>My {inventoryType.charAt(0).toUpperCase() + inventoryType.slice(1)}</h3>
                        <span className={style['number-items']}>{inventoryElements?.length ?? '-'}</span>
                        <p className={style.info}>(Select {addArticle(inventoryType.slice(0, -1))} to customize it)</p>
                    </div>
                    <NavInventory
                        type={inventoryType}
                        typeWithFilter={typeWithFilter}
                        sortByFunction={sortBy}
                        filterData={filterData}
                        changeFilters={changeFilters}
                    />
                </section>


                <div className={style['items-inventory']}>

                    {inventoryOffers && inventoryOffers.length > 0 &&
                        <ItemsInventory

                            items={inventoryOffers}
                            title={'In sale'}
                            type={inventoryType}
                            hasFilter={false}
                        />
                    }

                    <ItemsInventory
                        items={inventoryElements}
                        title={'My ' + inventoryType}
                        type={inventoryType}
                        hasFilter={typeWithFilter.includes(inventoryType)}
                        filters={filterData} />
                </div>
            </div>
        </>
    );
};

export default Inventory;
