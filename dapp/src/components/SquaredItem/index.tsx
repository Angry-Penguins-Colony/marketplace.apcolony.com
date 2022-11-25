import Skeleton from 'react-loading-skeleton';
import { Link } from 'react-router-dom';
import { IGenericElementOwned } from 'components/Inventory/ItemsInventory/IGenericElementOwned';
import style from './index.module.scss';

interface IItemProps {
    item?: IGenericElementOwned,
    children?: React.ReactNode,
    link?: string,
}

export const SquaredItem = ({
    item,
    children,
    link
}: IItemProps) => {

    const classNames = [
        style.item,
        item ? style.loaded : ''
    ].join(' ');

    return withLinkOrNot(
        <div className={classNames}>
            {
                item ?
                    <img src={item.thumbnailUrls.small} className={style.thumbnail} loading="lazy" />
                    :
                    <Skeleton className={style.thumbnail} />
            }
            <div className={style.name}>{item?.displayName}</div>

            {item?.ownedAmount &&
                <div className={style.count}>{item.ownedAmount}</div>
            }

            {children}
        </div>
    );

    function withLinkOrNot(component: JSX.Element): JSX.Element {
        if (link) {
            return <Link to={link}>{component}</Link>
        }
        else {
            return component;
        }
    }
}