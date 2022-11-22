import * as React from 'react';
import { IGenericElement } from '@apcolony/marketplace-api';
import Button from 'components/Abstract/Button/Button';
import Loading, { LoadingColor } from 'components/Abstract/Loading';
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
    makeItemComponent?: (item: IGenericElementOwned, key: React.Key) => JSX.Element,
    loadingColor?: LoadingColor,


    displayStakingStatus?: boolean,
    isStaked?: boolean,
    stakingFunction?: (type: string, itemNonce: number) => void
}

const ItemsInventory = ({
    className = '',
    contentClassName = '',
    items,
    type,
    title,
    hasFilter,
    makeItemComponent = (item, key) => {
        return (
            <div className={style['item-wrapper']} key={key}>
                <SquaredItem
                    key={item.id}
                    item={item}
                    link={buildLink(item)} />
                {displayStakingStatus && stakingFunction &&
                    <Button onClick={() => stakingFunction(isStaked ? 'unstake' : 'stake', item.nonce)}>
                        {isStaked ? 'Unstake' : 'Stake'}
                    </Button>
                }
            </div>
        )
    },
    loadingColor,
    displayStakingStatus = false,
    isStaked,
    stakingFunction,
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
            return <Loading size="large" color={loadingColor} />
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

