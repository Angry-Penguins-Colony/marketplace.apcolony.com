import * as React from 'react';
import { useParams } from 'react-router-dom';
import Button from 'components/Abstract/Button/Button';
import BuyingPopup from 'components/Foreground/Popup/BuyingPopup/BuyingPopup';
import ShareIcon from 'components/Icons/ShareIcon';
import ItemsAndActivities from 'components/Inventory/ItemsAndActivities/ItemsAndActivities';
import MobileHeader from 'components/Layout/MobileHeader/MobileHeader';
import { buildRouteLinks } from 'routes';
import useGetActivity from 'sdk/hooks/api/useGetActivity';
import useGetOffers from 'sdk/hooks/api/useGetOffers';
import CategoriesType from 'sdk/types/CategoriesType';
import { useGetGenericItem } from '../../sdk/hooks/api/useGetGenericItem';
import style from './index.module.scss';

const Inspect = () => {
    const params = useParams();
    const id = params.id;
    const type = params.type as CategoriesType;

    if (!type) throw new Error('type is required');
    if (!id) throw new Error('Item id is required');

    const { item, ownedByConnectedWallet } = useGetGenericItem(type, id);
    const activities = useGetActivity(type, id);
    const offers = useGetOffers(type, id);
    const isInMarket = offers ? offers.length > 0 : undefined;
    const [priceInMarket] = React.useState(0);

    const typeInText = getTypeInText();

    // sell popup
    const [isSellPopupOpen, setIsSellPopupOpen] = React.useState(false);

    return (
        <div id={style['item-in-inventory']}>
            <MobileHeader title={typeInText.plural} type='light' />
            <div className={style.thumbnail}>
                <img src={item?.thumbnail ?? ''} alt={item?.name ?? 'loading item'} />
            </div>
            <div className={style.infos}>
                <p className={style.name}>{item?.name ?? '---'}</p>
                <div className={style.share} onClick={() => {
                    if (!item) return;
                    window.navigator.share({
                        title: item.name,
                        text: 'Check out this item Angry Penguin Marketplace',
                        url: window.location.href,
                    })
                }}>
                    <ShareIcon />
                </div>
                <div className={style.rank}>Rank <span className={style.primary}>#{item?.rank ?? '----'}</span></div>
            </div>
            <div className={style.actions + (isInMarket ? ' ' + style['in-market'] : '')}>
                {ownedByConnectedWallet == true &&
                    <>
                        {
                            isInMarket ? (
                                <>
                                    <Button type='cancel-outline'>Retire offer</Button>
                                    <p className={style.price}>Listed for {priceInMarket} EGLD</p>
                                </>
                            ) : (
                                <>
                                    <Button type='normal' onClick={() => { setIsSellPopupOpen(true) }}>Sell {typeInText.singular}</Button>
                                    {
                                        type === 'penguins' &&
                                        <Button type='primary' onClick={() => {
                                            window.location.href = buildRouteLinks.customize(id);
                                        }}>Customize</Button>
                                    }
                                </>
                            )
                        }
                    </>
                }
            </div>
            <hr />
            <ItemsAndActivities items={item?.items ?? []} activities={activities} className={style.activity} />

            {item &&
                <BuyingPopup
                    onClose={() => { setIsSellPopupOpen(false) }}
                    onSell={() => { /*something*/ }}
                    item={item}
                    type={type}
                    visible={isSellPopupOpen}
                />
            }
        </div>
    );

    function getTypeInText() {
        switch (type) {
            case 'penguins':
                return {
                    singular: 'Penguin',
                    plural: 'Penguins'
                };

            case 'items':
                return {
                    singular: 'Item',
                    plural: 'Items'
                };

            default:
                throw new Error('Unknown type');
        }
    }
}

export default Inspect;