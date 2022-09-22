import * as React from 'react';
import { useParams } from 'react-router-dom';
import SearchIcon from 'components/Icons/SearchIcon';
import MobileHeader from 'components/Layout/MobileHeader/MobileHeader';
import style from './item-in-marketplace.module.scss';
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
    const [activities] = React.useState<Activity[]>([]);

    return (
        <div id={style['item-in-marketplace']}>
            <MobileHeader title={'Marketplace'} rightIcon={<SearchIcon />} type='light' />
            <Page data={type == 'item' ? item : penguin} type={type} activities={activities} />
        </div >
    );
};

export default ItemInMarketplace;