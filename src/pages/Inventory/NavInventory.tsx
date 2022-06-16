import * as React from 'react';
import CrossIcon from 'components/Icons/CrossIcon';
import SettingIcon from 'components/Icons/SettingIcon';
import SortIcon from 'components/Icons/SortIcon';
import FilterPopup from './FilterPopup';
import style from './nav-inventory.module.scss';

const NavInventory = ({
    className = '',
    type,
    typeWithFilter
}: {
    className?: string,
    type: string,
    typeWithFilter: string[],
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
        console.log('change sort to ' + sortType);

        setCurrentSortType(sortTypes.find(type => type.value === sortType) || sortTypes[0]);

        // TODO: sort items

        setSortPopupIsOpen(false);
    }

    function toggleSortPopup() {
        setSortPopupIsOpen(!sortPopupIsOpen);
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
                                <div className={style.filter}>
                                    <span className={style.name}>Hat</span>
                                    <span className={style.number}>3</span>
                                </div>
                                <div className={style.filter}>
                                    <span className={style.name}>Eyes</span>
                                    <span className={style.number}>8</span>
                                </div>
                                <div className={style.filter}>
                                    <span className={style.name}>Beack</span>
                                    <span className={style.number}>8</span>
                                </div>
                                <div className={style.filter}>
                                    <span className={style.name}>Beack</span>
                                    <span className={style.number}>8</span>
                                </div>
                                <div className={style.filter}>
                                    <span className={style.name}>Body</span>
                                    <span className={style.number}>3</span>
                                </div>
                                <div className={style.filter}>
                                    <span className={style.name}>Body</span>
                                    <span className={style.number}>3</span>
                                </div>
                                <div className={style.filter}>
                                    <span className={style.name}>Hat</span>
                                    <span className={style.number}>3</span>
                                </div>
                                <div className={style.filter}>
                                    <span className={style.name}>Hat</span>
                                    <span className={style.number}>3</span>
                                </div>
                                <div className={style['reset-filter'] + ' ' + style.desktop}>
                                    <CrossIcon className={style.icon} />
                                </div>
                            </div>
                            <div className={style['reset-filter'] + ' ' + style.mobile}>
                                <CrossIcon className={style.icon} />
                            </div>
                        </div>
                        <FilterPopup isOpen={filterIsOpen} closeFilter={() => setFilterIsOpen(false)} />
                    </>
                )
            }
        </>
    );
};

export default NavInventory;
