import * as React from 'react';
import CrossIcon from 'components/Icons/CrossIcon';
import SearchIcon from 'components/Icons/SearchIcon';
import Filters from '../types/Filters';
import style from './FilterPopup.module.scss';
import { ItemList } from './ItemList/ItemList';

const FilterPopup = ({
    className = '',
    isOpen = false,
    closeFilter,
    changeFilters = function () {
        // do nothing
    },
    filterData = {
        items: [],
        selected: []
    }
}: {
    className?: string,
    isOpen?: boolean,
    closeFilter?: () => void,
    changeFilters?: (filters: Filters,
        closePopup?: boolean
    ) => void,
    filterData?: Filters
}) => {
    function toggleAttribute(attributeValue: string, itemValue: string) {
        // change isTmpSelected
        const newFilterData = {
            ...filterData,
            items: filterData.items.map(item => {
                if (item.value === itemValue) {
                    return {
                        ...item,
                        attributes: item.attributes.map(attribute => {
                            if (attribute.value === attributeValue) {
                                return {
                                    ...attribute,
                                    isTmpSelected: !attribute.isTmpSelected
                                };
                            }
                            return attribute;
                        })
                    };
                }
                return item;
            })
        };

        changeFilters(newFilterData, false);
    }

    function resetFilters(closePopup = true) {
        // replace all isTmpSelected and isSelected to false
        const newFilterData = {
            ...filterData,
            items: filterData.items.map(item => {
                return {
                    ...item,
                    attributes: item.attributes.map(attribute => {
                        return {
                            ...attribute,
                            isTmpSelected: false,
                            isSelected: false
                        };
                    }
                    )
                };
            }
            )
        };

        changeFilters(newFilterData, closePopup);
    }

    function applyFilters(closePopup = true) {
        // replace all isTmpSelected to isSelected
        const newFilterData = {
            ...filterData,
            items: filterData.items.map(item => {
                return {
                    ...item,
                    attributes: item.attributes.map(attribute => {
                        return {
                            ...attribute,
                            isSelected: attribute.isTmpSelected
                        };
                    }
                    )
                };
            }
            )
        };

        changeFilters(newFilterData, closePopup);
    }

    return (
        <div className={style.popup + ' ' + className + ' ' + (isOpen ? style.open : style.close)}>
            <div className={style.close} onClick={closeFilter}>
                <CrossIcon />
            </div>
            <div className={style.content}>
                <header>
                    <div className={style.close} onClick={closeFilter}>
                        <CrossIcon />
                    </div>
                    <h2>Properties</h2>
                    <div className={style['search-bar']}>
                        <SearchIcon />
                        <input type="text" placeholder="Search..." />
                    </div>
                </header>
                <div className={style.list}>
                    {
                        filterData.items.map((item) => {
                            return (
                                <ItemList
                                    title={item.title}
                                    icon={item.icon}
                                    attributes={item.attributes}
                                    toggleAttribute={toggleAttribute}
                                    value={item.value}
                                    key={item.value} />
                            );
                        })
                    }
                </div>
                <div className={style.control}>
                    <button onClick={() => resetFilters()}>Clear All</button>
                    <button className={style.filled} onClick={() => applyFilters()}>Apply</button>
                </div>
            </div>
        </div>
    );
};

export default FilterPopup;