import * as React from 'react';
import { IGenericElement } from '@apcolony/marketplace-api';
import { Link } from 'react-router-dom';
import Button from 'components/Abstract/Button/Button';
import Loading from 'components/Abstract/Loading';
import ReactImageAppear from 'components/Images/ReactImageAppear/ReactImageAppear';
import { buildRouteLinks } from 'routes';
import CategoriesType from 'sdk/types/CategoriesType';
import Filters from '../../../sdk/types/Filters';
import style from './ItemsInventory.module.scss';

interface IGenericElementOwned extends IGenericElement {
    ownedAmount?: number;
}

interface IProps {
    className?: string,
    items?: IGenericElementOwned[],
    type: CategoriesType,
    hasFilter: boolean,
    filters?: Filters,
    title?: string,
    makeItemComponent?: (item: IGenericElementOwned, key: React.Key) => JSX.Element,
    displayStakingStatus?: boolean,
    isStaked?: boolean,
    stakingFunction?: (type: string, itemNonce: number) => void
}

const ItemsInventory = ({
    className = '',
    items,
    type,
    title,
    hasFilter,
    makeItemComponent = (item, key) => {
        return (
            <div className={style['item-wrapper']} key={key}>
                <Item
                    key={item.id}
                    item={item}
                    type={type} />
                {displayStakingStatus && stakingFunction &&
                    <Button onClick={() => stakingFunction(isStaked ? 'unstake' : 'stake', item.nonce)}>
                        {isStaked ? 'Unstake' : 'Stake'}
                    </Button>
                }
            </div>
        )
    },
    displayStakingStatus = false,
    isStaked,
    stakingFunction
}: IProps) => {
    return (
        <div className={style['all-items'] + ' ' + className + ' ' + style[type] + (hasFilter ? ' ' + style['has-filter'] : '')}>
            {title &&
                <h2>{title}</h2>
            }
            <div className={style.content}>
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
                    .map(item => makeItemComponent(item, item.id));
            }
            else {
                return <p>You own 0 {type}.</p>
            }
        }
        else {
            return <Loading size="large" />
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    function match(item: IGenericElement) {
        return true;
    }
};

export default ItemsInventory;

interface IItemProps {
    item: {
        name: string,
        ownedAmount?: number,
        thumbnailUrls: {
            small: string;
        },
        id: string
    },
    type: CategoriesType,
    children?: React.ReactNode
}

const Item = ({
    item,
    type,
    children
}: IItemProps) => {

    return (
        <Link to={buildRouteLinks.inspect(type, item.id)}>
            <div className={style.item}>
                <ReactImageAppear src={item.thumbnailUrls.small} />
                <div className={style.name}>{item.name}</div>
                {(item.ownedAmount && type == 'items') &&
                    <div className={style.count}>{item.ownedAmount}</div>
                }

                {children}
            </div>
        </Link>
    );
}