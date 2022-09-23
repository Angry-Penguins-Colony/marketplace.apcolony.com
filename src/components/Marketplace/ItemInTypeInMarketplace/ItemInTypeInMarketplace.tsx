import * as React from 'react';
import { useParams } from 'react-router-dom';
import UnderlineNavElmt from 'components/Abstract/UnderlineNavElmt/UnderlineNavElmt';
import SearchIcon from 'components/Icons/SearchIcon';
import MobileHeader from 'components/Layout/MobileHeader/MobileHeader';
import MarketData from '../TypeInMarketplace/MarketData/MarketData';
import style from './ItemInTypeInMarketplace.module.scss';
import SquareItem from './SquareItem/SquareItem';

const ItemInTypeInMarketplace = () => {
    // get penguin informations from url
    const { type, itemId } = useParams();

    // get title by api call
    const [title, setTitle] = React.useState<string>(itemId || '???');
    React.useEffect(() => {
        // TODO: simulate api call
        setTimeout(() => {
            setTitle('Red Bitcoin Cap');
        }, 1000);
    }, []);

    // get marketplace data by api call
    const [marketplace, setMarketplace] = React.useState({
        floorPrice: 0,
        totalVolume: 0,
        averagePrice: 0,
        totalListed: 0,
        description: ''
    });
    React.useEffect(() => {
        // TODO: simulate api call
        setTimeout(() => {
            setMarketplace({
                floorPrice: 12,
                totalVolume: 5,
                averagePrice: 45,
                totalListed: 2,
                description: 'Beniamin’s favorite hat. Ask him he’ll tell you that it’s true.'
            });
        }, 1000);
    }, []);

    // get all items
    const [items, setItems] = React.useState<any[]>([]);
    React.useEffect(() => {
        // TODO: simulate api call
        setTimeout(() => {
            setItems([
                {
                    id: 1,
                    name: 'Red Bitcoin Cap',
                    thumbnail: 'https://apc.mypinata.cloud/ipfs/QmPedYjytKYzCvU1rte4YE6ya3Hrt6PEuffg6bsNBt1Dr2',
                    price: 5,
                },
                {
                    id: 2,
                    name: 'Red Bitcoin Cap',
                    thumbnail: 'https://apc.mypinata.cloud/ipfs/QmPedYjytKYzCvU1rte4YE6ya3Hrt6PEuffg6bsNBt1Dr2',
                    price: 8,
                },
                {
                    id: 3,
                    name: 'Red Bitcoin Cap',
                    thumbnail: 'https://apc.mypinata.cloud/ipfs/QmPedYjytKYzCvU1rte4YE6ya3Hrt6PEuffg6bsNBt1Dr2',
                    price: 12,
                },
                {
                    id: 58,
                    name: 'Red Bitcoin Cap',
                    thumbnail: 'https://apc.mypinata.cloud/ipfs/QmPedYjytKYzCvU1rte4YE6ya3Hrt6PEuffg6bsNBt1Dr2',
                    price: 5,
                },
                {
                    id: 289,
                    name: 'Red Bitcoin Cap',
                    thumbnail: 'https://apc.mypinata.cloud/ipfs/QmPedYjytKYzCvU1rte4YE6ya3Hrt6PEuffg6bsNBt1Dr2',
                    price: 5.5,
                },
            ]);
        }, 1000);
    }, []);


    return (
        <div className={style['item-in-type-in-marketplace']}>
            <MobileHeader title={'Marketplace'} rightIcon={<SearchIcon />} type='light' />
            <h1>{title}</h1>
            <MarketData floorPrice={marketplace.floorPrice} totalVolume={marketplace.totalVolume} averagePrice={marketplace.averagePrice} totalListed={marketplace.totalListed} />
            <p className={style.description}>{marketplace.description}</p>
            <div className={style.labels}>
                {/* TODO: bind label active */}
                <UnderlineNavElmt name={'Offers'} isActive={true} />
                <UnderlineNavElmt name={'Ranking'} isActive={false} />
                <UnderlineNavElmt name={'Activity'} isActive={false} />
            </div>
            {/* TODO: add filters */}
            <div className={style.items}>
                {
                    items.map((item, index) => {
                        return (
                            <SquareItem thumbnail={item.thumbnail} name={item.name} price={item.price} key={index} className={style.item} onClick={() => {
                                window.location.href = `/marketplace/${type}/${item.id}`;
                            }} />
                        );
                    })
                }
            </div>
        </div>
    );
};

export default ItemInTypeInMarketplace;