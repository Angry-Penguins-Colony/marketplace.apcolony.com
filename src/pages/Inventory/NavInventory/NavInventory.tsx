import * as React from 'react';
import CrossIcon from 'components/Icons/CrossIcon';
import SettingIcon from 'components/Icons/SettingIcon';
import SortIcon from 'components/Icons/SortIcon';
import FilterPopup from '../FilterPopup/FilterPopup';
import Filters from '../types/Filters';
import style from './NavInventory.module.scss';

const NavInventory = ({
    className = '',
    type,
    typeWithFilter,
    sortByFunction = function () {
        // do nothing
    },
    filterData = {
        items: [],
        selected: []
    },
    changeFilters = function () {
        // do nothing
    }
}: {
    className?: string,
    type: string,
    typeWithFilter: string[],
    sortByFunction?: (type: string) => void,
    filterData?: Filters,
    changeFilters?: (filters: Filters) => void
}) => {
    const [filterIsOpen, setFilterIsOpen] = React.useState(false);

    function openFilter() {
        setFilterIsOpen(true);
    }

    const sortTypes = [
        {
            name: 'Recently Added',
            value: 'recently-added'
        },
        {
            name: 'Rarity: High to low',
            value: 'rarity-high-to-low'
        },
        {
            name: 'Rarity: Low to high',
            value: 'rarity-low-to-high'
        }
    ];

    const [currentSortType, setCurrentSortType] = React.useState(sortTypes[0]);
    const [sortPopupIsOpen, setSortPopupIsOpen] = React.useState(false);

    function changeSort(sortType: string) {
        setCurrentSortType(sortTypes.find(aType => aType.value === sortType) || sortTypes[0]);

        // sort items
        sortByFunction(sortType);

        setSortPopupIsOpen(false);
    }

    function toggleSortPopup() {
        setSortPopupIsOpen(!sortPopupIsOpen);
    }


    function resetFilters() {
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

        changeFilters(newFilterData);
    }

    return (
        <>
            {
                typeWithFilter.includes(type) && (
                    <>
                        <div className={style.nav + ' ' + className}>
                            <h2>Filters</h2>
                            {
                                sortPopupIsOpen && (
                                    <div className={style['filter-popup']}>
                                        <p className={style.title}>Sort by</p>
                                        {
                                            sortTypes.map((sortType, index) => (
                                                <p
                                                    key={index}
                                                    className={style['sort-type'] + ' ' + (sortType.value === currentSortType.value ? style.active : '')}
                                                    onClick={() => changeSort(sortType.value)}
                                                >
                                                    {sortType.name}
                                                </p>
                                            ))
                                        }
                                    </div>
                                )
                            }
                            <div className={style.content}>
                                <div className={style.sort} onClick={toggleSortPopup}>
                                    <SortIcon className={style['icon-sort']} />
                                </div>
                                <div className={style['select-filter'] + ' ' + style.filter} onClick={(openFilter)}>
                                    <SettingIcon />
                                    <span className={style.name}>Filters</span>
                                </div>
                                {
                                    filterData.selected.length > 0 && (
                                        filterData.selected.map((filter, index) => (
                                            <div className={style.filter} key={index}>
                                                <span className={style.name}>{filter.name}</span>
                                                <span className={style.number}>{filter.number}</span>
                                            </div>
                                        ))
                                    )
                                }
                                {
                                    filterData.selected.length > 0 && (
                                        <div className={style['reset-filter'] + ' ' + style.desktop}
                                            onClick={resetFilters} >
                                            <CrossIcon className={style.icon} />
                                        </div>
                                    )
                                }
                            </div>
                            {
                                filterData.selected.length > 0 && (
                                    <div className={style['reset-filter'] + ' ' + style.mobile}
                                        onClick={resetFilters} >
                                        <CrossIcon className={style.icon} />
                                    </div>
                                )
                            }
                        </div>
                        <FilterPopup
                            isOpen={filterIsOpen}
                            closeFilter={() => setFilterIsOpen(false)}
                            changeFilters={
                                (filters, closePopup = true) => {
                                    changeFilters(filters);
                                    if (closePopup) {
                                        setFilterIsOpen(false);
                                    }
                                }
                            }
                            filterData={filterData}
                        />
                    </>
                )
            }
        </>
    );
};

export default NavInventory;
