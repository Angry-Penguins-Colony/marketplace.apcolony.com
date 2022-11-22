import { Link } from 'react-router-dom';
import { IGenericElementOwned } from 'components/Inventory/ItemsInventory/IGenericElementOwned';
import style from './index.module.scss';

interface IItemProps {
    item: IGenericElementOwned,
    children?: React.ReactNode,
    link: string,
}

export const SquaredItem = ({
    item,
    children,
    link
}: IItemProps) => {


    return (
        <Link to={link}>
            <div className={style.item}>
                <img src={item.thumbnailUrls.small} loading="lazy" />
                <div className={style.name}>{item.displayName}</div>
                {(item.ownedAmount) &&
                    <div className={style.count}>{item.ownedAmount}</div>
                }

                {children}
            </div>
        </Link>
    );
}