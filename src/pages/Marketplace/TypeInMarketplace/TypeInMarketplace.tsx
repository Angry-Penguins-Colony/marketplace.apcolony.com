import * as React from 'react';
import { useParams } from 'react-router-dom';
import SearchIcon from 'components/Icons/SearchIcon';
import MobileHeader from 'components/Layout/MobileHeader/MobileHeader';
import UnderlineNavElmt from 'components/UnderlineNavElmt/UnderlineNavElmt';
import { Item } from '../ItemInMarketplace/Item';
import defaultPenguinImg from './../../../assets/img/penguin_default.png';
import MarketData from './MarketData';
import style from './type-in-marketplace.module.scss';

// TODO: for penguin

const TypeInMarketplace = () => {
    // get penguin informations from url
    const { type, typeId } = useParams();

    // get title by api call
    const [title, setTitle] = React.useState<string>(typeId || '???');
    React.useEffect(() => {
        // TODO: simulate api call
        setTimeout(() => {
            setTitle('Hat');
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
                description: 'Infos eggs Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor'
            });
        }, 1000);
    }, []);

    // get all variant of this item by api call
    const [variants, setVariants] = React.useState<any[]>([]);
    React.useEffect(() => {
        // TODO: simulate api call
        setTimeout(() => {
            setVariants([
                {
                    id: '140',
                    type: 'hat',
                    name: 'Red Bitcoin Cap',
                    thumbnail: 'https://apc.mypinata.cloud/ipfs/QmPedYjytKYzCvU1rte4YE6ya3Hrt6PEuffg6bsNBt1Dr2',
                    render: 'https://apc.mypinata.cloud/ipfs/QmP1ToS4iwZrsZkAsBMYcC7QR5Kewx8kojGFvH8jCkx2J6',
                    rarity: 1,
                },
                {
                    id: '148',
                    type: 'hat',
                    name: 'Golden Captain',
                    thumbnail: 'https://apc.mypinata.cloud/ipfs/QmTzCufPq9Aem3t14YLppf1Cqqu272ghaycQBdHrjG7Qog',
                    render: 'https://apc.mypinata.cloud/ipfs/QmckLyN7pHBDCUGrwQ9zCqYKNdFT7K41YvoXmCawS1hgyD',
                    rarity: 1,
                },
                {
                    id: '1008',
                    type: 'hat',
                    name: 'Barrel Hat',
                    thumbnail: 'https://apc.mypinata.cloud/ipfs/QmRBndnipYJrKp8R3TSaQDE2UjxMwh8S7AA9t6w63mtBFN',
                    render: 'https://apc.mypinata.cloud/ipfs/QmSz6HeM9BxegB9PyTci7a3gzDwULMmhkWfzmh1Z1cJged',
                    rarity: 1,
                },
            ]);
        }, 1000);
    }, []);


    return (
        <div className={style['type-in-marketplace']}>
            <MobileHeader title={'Marketplace'} rightIcon={<SearchIcon />} type='light' />
            <h1>{title}</h1>
            <MarketData floorPrice={marketplace.floorPrice} totalVolume={marketplace.totalVolume} averagePrice={marketplace.averagePrice} totalListed={marketplace.totalListed} />
            <p className={style.description}>{marketplace.description}</p>
            <div className={style.labels}>
                <UnderlineNavElmt name={'Offers'} isActive={true} />
            </div>
            {/* TODO: add filters */}
            <div className={style.items}>
                {
                    variants.map(variant => (
                        <>
                            <Item item={variant} key={variant.id} displayId={false} className={style.mobile} onClick={
                                () => {
                                    window.location.href = `/marketplace/item/i/${variant.type}/${variant.id}`;
                                }
                            } />
                            <div className={style.desktop} onClick={
                                () => {
                                    window.location.href = `/marketplace/item/i/${variant.type}/${variant.id}`;
                                }
                            }>
                                <img src={defaultPenguinImg} alt="default background of any penguin" className={style.background} />
                                <img src={variant.render} alt="" className={style.item} />
                                <div className={style.infos}>
                                    <div className={style.name}>{variant.name}</div>
                                    <div className={style.rarity}>Rarity: {variant.rarity}%</div>
                                </div>
                            </div>
                        </>
                    ))
                }
            </div>
        </div >
    );
};

export default TypeInMarketplace;