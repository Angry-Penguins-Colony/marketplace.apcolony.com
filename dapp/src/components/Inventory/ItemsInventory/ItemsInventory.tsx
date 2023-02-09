import * as React from 'react';
import { IGenericElement } from '@apcolony/marketplace-api';
import Button from 'components/Abstract/Button/Button';
import { LoadingColor } from 'components/Abstract/Loading';
import { SquaredItem } from 'components/SquaredItem';
import { buildRouteLinks } from 'routes';
import CategoriesType from 'sdk/types/CategoriesType';
import Filters from '../../../sdk/types/Filters';
import { IGenericElementOwned } from './IGenericElementOwned';
import style from './ItemsInventory.module.scss';

interface IProps {
    className?: string,
    contentClassName?: string,
    items?: IGenericElementOwned[],
    type: CategoriesType,
    hasFilter: boolean,
    filters?: Filters,
    title?: string,
    buildLink?: (item: IGenericElementOwned) => string,
    makeItemComponent?: (item: IGenericElementOwned | undefined, key: React.Key) => JSX.Element,
    loadingColor?: LoadingColor,
    displayStakingStatus?: boolean,
    noncesForStakingTx?: number[],
    addNonceToStakingTx?: (itemNonce: number) => void
}

const ItemsInventory = ({
    className = '',
    contentClassName = '',
    items,
    type,
    title,
    hasFilter,
    makeItemComponent = (item, key) => {
        //If noncesForStakingTx include the item nonce, then display the staking status
        const selectedClass = noncesForStakingTx && item && noncesForStakingTx.includes(item.nonce) ? style['selected'] : '';
        return (
            <div className={style['item-wrapper'] + ' ' + selectedClass} key={key} 
            onClick={()=>(
                item && displayStakingStatus && addNonceToStakingTx(item.nonce)
            )}>
                <SquaredItem
                    item={item}
                    link={item && !displayStakingStatus ? buildLink(item) : undefined} />
            </div>
        )
    },
    displayStakingStatus = false,
    addNonceToStakingTx = (itemNonce) => { },
    noncesForStakingTx = [],
    buildLink = (item) => buildRouteLinks.inspect(type, item.id)
}: IProps) => {
    return (
        <div className={style['all-items'] + ' ' + className + ' ' + style['penguins'] + (hasFilter ? ' ' + style['has-filter'] : '')}>
            {title &&
                <h2>{title}</h2>
            }
            <div className={style.content + ' ' + contentClassName}>
                {fillContent()}
            </div>
        </div>
    );

    function fillContent() {

        if (items) {

            const matchedItems = items
                .filter(item => match(item));

            if (matchedItems.length > 0) {
                return matchedItems
                    .sort(compareItems)
                    .map(item => makeItemComponent(item, item.id));
            }
            else {
                return <p>You own 0 {type}.</p>
            }
        }
        else {
            return Array.from({ length: 10 }).map((_, i) => makeItemComponent(undefined, i));
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    function match(item: IGenericElement) {
        return true;
    }
};

export default ItemsInventory;

function compareItems(a: IGenericElementOwned, b: IGenericElementOwned) {
    return parseInt(a.id) - parseInt(b.id);
}



