import * as React from 'react';
import { IGenericElement } from '@apcolony/marketplace-api';
import { Link } from 'react-router-dom';
import Button from 'components/Abstract/Button/Button';
import Loading, { LoadingColor } from 'components/Abstract/Loading';
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
                <Item
                    key={item.id}
                    item={item}
                    type={type}
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

interface IItemProps {
    item: IGenericElementOwned,
    type: CategoriesType,
    children?: React.ReactNode,
    link: string,
}

const Item = ({
    item,
    type,
    children,
    link
}: IItemProps) => {


    return (
        <Link to={link}>
            <div className={style.item}>
                <ReactImageAppear src={item.thumbnailUrls.small} />
                <div className={style.name}>{item.displayName}</div>
                {(type != 'penguins') &&
                    <div className={style.count}>{item.ownedAmount}</div>
                }

                {children}
            </div>
        </Link>
    );
}