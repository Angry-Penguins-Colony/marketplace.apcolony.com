import * as React from 'react';
import { useParams } from 'react-router-dom';
import Button from 'components/Button/Button';
import SearchIcon from 'components/Icons/SearchIcon';
import MobileHeader from 'components/Layout/MobileHeader/MobileHeader';
import BuyingPopup from './BuyingPopup';
import { Item as ItemComponent } from './Item';
import style from './item-in-marketplace.module.scss';
import ItemsAndActivities from './ItemsAndActivities';
import Page from './Page';

interface Item {
    id: string,
    type: string,
    name: string,
    thumbnail: string,
    rarity: number
    owner?: string;
    price?: number;
}

interface Penguin {
    id: string;
    thumbnail: string;
    name: string;
    price: number;
    owner: string;
    rank: number;
    rarityScore: number;
    items: Item[]
}

const ItemInMarketplace = () => {
    // get penguin informations from url
    const { type, id } = useParams();

    const [penguin, setPenguin] = React.useState<Penguin>({
        id: id || '????',
        thumbnail: '/assets/img/penguin_default.png',
        name: 'Penguin #????',
        price: 0,
        owner: '????????????????',
        rank: 0,
        rarityScore: 0,
        items: []
    });
    const [item, setItem] = React.useState<Item>({
        id: id || '????',
        type: '????',
        thumbnail: '/assets/img/penguin_default.png', // TODO: add default img for item
        name: 'item #????',
        price: 0,
        owner: '????????????????',
        rarity: 0
    });


    React.useEffect(() => {
        // get penguin informations from url
        // TODO: simulate api call
        if (type === 'item') {
            setTimeout(() => {
                setItem({
                    id: '0001',
                    type: 'background',
                    name: 'Oceanis Trench',
                    thumbnail: 'https://apc.mypinata.cloud/ipfs/QmTzCufPq9Aem3t14YLppf1Cqqu272ghaycQBdHrjG7Qog',
                    rarity: 2.6,
                    price: 8,
                    owner: 'erd1pxljk7hukrjzq3cc0y00s5zs9r49q8pcc7wn6n8g752nuxpwdmfsxlm5y3'
                });
            }, 750);
        } else {
            setTimeout(() => {
                setPenguin({
                    id: id || '????',
                    thumbnail: 'https://media.elrond.com/nfts/asset/QmUCfP5ArCzgiYWMgw1JfinSTzEfHpCeQc4qSfrZGwtLDq',
                    name: 'Penguin #5390',
                    price: 5,
                    owner: 'erd1pxljk7hukrjzq3cc0y00s5zs9r49q8pcc7wn6n8g752nuxpwdmfsxlm5y3',
                    rank: 101,
                    rarityScore: 5455,
                    items: [
                        {
                            id: '0001',
                            type: 'background',
                            name: 'Oceanis Trench',
                            thumbnail: 'https://apc.mypinata.cloud/ipfs/QmTzCufPq9Aem3t14YLppf1Cqqu272ghaycQBdHrjG7Qog',
                            rarity: 2.6
                        },
                        {
                            id: '0002',
                            type: 'beack',
                            name: 'Hook',
                            thumbnail: 'https://apc.mypinata.cloud/ipfs/QmTzCufPq9Aem3t14YLppf1Cqqu272ghaycQBdHrjG7Qog',
                            rarity: 25.8
                        },
                        {
                            id: '0003',
                            type: 'clothes',
                            name: 'Lifeguard T-shirt',
                            thumbnail: 'https://apc.mypinata.cloud/ipfs/QmTzCufPq9Aem3t14YLppf1Cqqu272ghaycQBdHrjG7Qog',
                            rarity: 2
                        },
                        {
                            id: '0004',
                            type: 'eyes',
                            name: 'Wounded',
                            thumbnail: 'https://apc.mypinata.cloud/ipfs/QmTzCufPq9Aem3t14YLppf1Cqqu272ghaycQBdHrjG7Qog',
                            rarity: 8.5
                        },
                        {
                            id: '0005',
                            type: 'hat',
                            name: 'EGLD Headscarf',
                            thumbnail: 'https://apc.mypinata.cloud/ipfs/QmTzCufPq9Aem3t14YLppf1Cqqu272ghaycQBdHrjG7Qog',
                            rarity: 2.3
                        },
                        {
                            id: '0006',
                            type: 'skin',
                            name: 'unequipped',
                            thumbnail: 'https://apc.mypinata.cloud/ipfs/QmTzCufPq9Aem3t14YLppf1Cqqu272ghaycQBdHrjG7Qog',
                            rarity: 37
                        },
                        {
                            id: '0007',
                            type: 'weapon',
                            name: 'Flamethrower',
                            thumbnail: 'https://apc.mypinata.cloud/ipfs/QmTzCufPq9Aem3t14YLppf1Cqqu272ghaycQBdHrjG7Qog',
                            rarity: 0.9
                        }
                    ]
                });
            }, 750);
        }
    }, [id]);


    // activity tab
    interface Activity {
        id: string;
        price: number;
        from: string;
        to: string;
        date: string;
    }
    const [activities, setActivities] = React.useState<Activity[]>([]);

    function getActivities() {
        // simulate api call
        setTimeout(() => {
            setActivities([
                {
                    id: '1ba48da9bdf8224dbbe0fbe85a51d27d3075620278e8e0af666788a3d857cd30',
                    price: 5,
                    from: 'erd1pxljk7hukrjzq3cc0y00s5zs9r49q8pcc7wn6n8g752nuxpwdmfsxlm5y3',
                    to: 'erd1pxljk7hukrjzq3cc0y00s5zs9r49q8pcc7wn6n8g752nuxpwdmfsxlm5y3',
                    date: '2020-01-01'
                },
                {
                    id: '1ba48da9bdf8224dbbe0fbe85a51d27d3075620278e8e0af666788a3d857cd31',
                    price: 5,
                    from: 'erd1pxljk7hukrjzq3cc0y00s5zs9r49q8pcc7wn6n8g752nuxpwdmfsxlm5y3',
                    to: 'erd1pxljk7hukrjzq3cc0y00s5zs9r49q8pcc7wn6n8g752nuxpwdmfsxlm5y3',
                    date: '2020-01-01'
                },
                {
                    id: '1ba48da9bdf8224dbbe0fbe85a51d27d3075620278e8e0af666788a3d857cd32',
                    price: 5,
                    from: 'erd1pxljk7hukrjzq3cc0y00s5zs9r49q8pcc7wn6n8g752nuxpwdmfsxlm5y3',
                    to: 'erd1pxljk7hukrjzq3cc0y00s5zs9r49q8pcc7wn6n8g752nuxpwdmfsxlm5y3',
                    date: '2020-01-01'
                },
                {
                    id: '1ba48da9bdf8224dbbe0fbe85a51d27d3075620278e8e0af666788a3d857cd33',
                    price: 5,
                    from: 'erd1pxljk7hukrjzq3cc0y00s5zs9r49q8pcc7wn6n8g752nuxpwdmfsxlm5y3',
                    to: 'erd1pxljk7hukrjzq3cc0y00s5zs9r49q8pcc7wn6n8g752nuxpwdmfsxlm5y3',
                    date: '2020-01-01'
                },
                {
                    id: '1ba48da9bdf8224dbbe0fbe85a51d27d3075620278e8e0af666788a3d857cd34',
                    price: 5,
                    from: 'erd1pxljk7hukrjzq3cc0y00s5zs9r49q8pcc7wn6n8g752nuxpwdmfsxlm5y3',
                    to: 'erd1pxljk7hukrjzq3cc0y00s5zs9r49q8pcc7wn6n8g752nuxpwdmfsxlm5y3',
                    date: '2020-01-01'
                }
            ]);
        }, 750);
    }

    return (
        <div id={style['item-in-marketplace']}>
            <MobileHeader title={'Marketplace'} rightIcon={<SearchIcon />} type='light' />
            <Page data={type == 'item' ? item : penguin} type={type} activities={activities} getActivities={getActivities} />
        </div >
    );
};

export default ItemInMarketplace;