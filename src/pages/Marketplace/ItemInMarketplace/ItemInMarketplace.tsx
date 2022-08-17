import * as React from 'react';
import { useParams } from 'react-router-dom';
import Button from 'components/Button/Button';
import SearchIcon from 'components/Icons/SearchIcon';
import MobileHeader from 'components/Layout/MobileHeader/MobileHeader';
import style from './item-in-marketplace.module.scss';

interface Penguin {
    id: string;
    thumbnail: string;
    name: string;
    price: number;
    owner: string;
    rank: number;
    rarityScore: number;
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
    });

    React.useEffect(() => {
        // get penguin informations from url
        // TODO: simulate api call
        setTimeout(() => {
            setPenguin({
                id: id || '????',
                thumbnail: 'https://media.elrond.com/nfts/asset/QmUCfP5ArCzgiYWMgw1JfinSTzEfHpCeQc4qSfrZGwtLDq',
                name: 'Penguin #5390',
                price: 5,
                owner: 'erd1pxljk7hukrjzq3cc0y00s5zs9r49q8pcc7wn6n8g752nuxpwdmfsxlm5y3',
                rank: 101,
                rarityScore: 5455,
            });
        }, 750);
    }, [id]);


    return (
        <div id={style['item-in-marketplace']}>
            <MobileHeader title={'Marketplace'} rightIcon={<SearchIcon />} type='light' />
            <section className={style.thumbnail}>
                <img src={penguin.thumbnail} alt={penguin.name} />
            </section>
            <section className={style.infos}>
                <div className={style.right}>
                    <p className={style.name}>{penguin.name}</p>
                    <p className={style.price}>{penguin.price} EGLD</p>
                    <p className={style['owner-title']}>Owner</p>
                    <p className={style.owner}>{penguin.owner}</p>
                </div>
                <div className={style.left}>
                    <p className={style.rank}>Rank #{penguin.rank}</p>
                    <p className={style['rarity-score']}>Rarity Score: {penguin.rarityScore}</p>
                </div>
            </section>
            <section className={style.buy}>
                {/* TODO: bind button */}
                <Button>Buy for {penguin.price} EGLD</Button>
            </section>
        </div>
    );
};

export default ItemInMarketplace;