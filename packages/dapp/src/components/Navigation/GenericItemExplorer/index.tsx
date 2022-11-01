import * as React from 'react';
import { Link } from 'react-router-dom';
import style from './style.module.scss';

export const GenericItemExplorer = (
    {
        thumbnail,
        name,
        onClick = () => {
            // do nothing
        },
        link
    }: {
        thumbnail: string;
        name: string;
        onClick?: () => void;
        link?: string
    }
) => {

    return withLink(
        <div className={style['item-or-penguin']} onClick={onClick}>
            {
                // (count > 1) && (
                //     <div className={style.count}>
                //         {count}
                //     </div>
                // )
            }
            <div className={style.thumbnail}>
                <img src={thumbnail} alt={'thumbnail of ' + name} />
            </div>
            <div className={style.info}>
                <h3 className={style.name}>{name}</h3>
                {/* <p className={style.price}>
                    {
                        (count > 1) ? (
                            <span className={style.label}>Starting at : </span>
                            ) : (
                                <span className={style.label}>Price : </span>
                                )
                            }
                            <span className={style.price}>{floorPrice.toString()} EGLD</span>
                        </p> */}
            </div>
        </div>
    );

    function withLink(children: JSX.Element) {
        if (link) {
            return (
                <Link to={link}>
                    {children}
                </Link>
            );

        }
        else {
            return children;
        }
    }
};
