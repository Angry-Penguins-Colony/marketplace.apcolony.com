import React from 'react';
import Skeleton from 'react-loading-skeleton';
import ShareIcon from 'components/Icons/ShareIcon';
import style from './index.module.scss';

interface Props {
    itemData?: { url: string; displayName: string; }
    children?: React.ReactNode;
    subProperties?: React.ReactNode;
}

const ItemPageLayout = ({ itemData, subProperties, children }: Props) => {



    return <div id={style['item-in-inventory']}>

        <div className={style.thumbnail}>
            {
                itemData ?
                    <img className={style.img} src={itemData.url} alt={itemData.displayName} />
                    :
                    <Skeleton height={250} />
            }
        </div>

        <div className={style.infos}>
            <p className={style.name}>{itemData?.displayName ?? <Skeleton />}</p>
            <div className={style.share} onClick={() => {
                if (!itemData) return;
                window.navigator.share({
                    title: itemData.displayName,
                    text: 'Check out this item Angry Penguin Marketplace',
                    url: window.location.href,
                })
            }}>
                <ShareIcon />
            </div>
            <div className={style.rank}>
                {subProperties}
            </div>
        </div>

        {children}
    </div >
};

export default ItemPageLayout;