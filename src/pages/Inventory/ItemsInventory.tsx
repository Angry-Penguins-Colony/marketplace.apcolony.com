import * as React from 'react';
import Filters from './Filters';
import style from './item-inventory.module.scss';

const ItemsInventory = ({
    className = '',
    items,
    type,
    hasFilter,
    filters
}: {
    className?: string,
    items: any[],
    type: string,
    hasFilter: boolean,
    filters?: Filters
}) => {
    const title = 'My ' + type.charAt(0).toUpperCase() + type.slice(1);

    return (
        <div className={style['all-items'] + ' ' + className + ' ' + style[type] + (hasFilter ? ' ' + style['has-filter'] : '')}>
            <h2>{title}</h2>
            <div className={style.content}>
                {
                    items.map((item: any, index: number) => {
                        /* return just if has element in filters */

                        let isMatched = true;
                        if (filters) {
                            filters.selected.forEach((selectedElmt: {
                                name: string;
                                value: string;
                                number: number;
                            }) => {
                                if (item.attributes) {
                                    const currentAttribute = item.attributes.find((attribute: {
                                        traitType: string;
                                        value: string;
                                    }) => {
                                        return attribute.traitType === selectedElmt.value;
                                    });
                                    if (currentAttribute) {
                                        const currentFilter = filters.items.find((filter: {
                                            title: string;
                                            value: string;
                                            icon: string;
                                            attributes: {
                                                name: string;
                                                number: number;
                                                value: string;
                                                isSelected: boolean;
                                                isTmpSelected: boolean;
                                            }[]
                                        }) => {
                                            return filter.value === currentAttribute.traitType;
                                        });

                                        if (currentFilter) {
                                            const isCurrentAttributeSelected = currentFilter.attributes.find((attr: {
                                                name: string;
                                                number: number;
                                                value: string;
                                                isSelected: boolean;
                                                isTmpSelected: boolean;
                                            }) => {

                                                return attr.name === currentAttribute.value && attr.isSelected === true;
                                            });

                                            if (!isCurrentAttributeSelected) {
                                                isMatched = false;
                                            }
                                        } else {
                                            isMatched = false;
                                        }
                                    } else {
                                        isMatched = false;
                                    }
                                } else {
                                    isMatched = false;
                                }
                            });
                        }

                        if (isMatched) {
                            return (
                                <div className={style.item} key={index}>
                                    <img src={item.image} />
                                    <div className={style.name}>{item.name}</div>
                                </div>
                            );
                        } else {
                            return null;
                        }
                    })
                }
            </div>
        </div>
    );
};

export default ItemsInventory;
