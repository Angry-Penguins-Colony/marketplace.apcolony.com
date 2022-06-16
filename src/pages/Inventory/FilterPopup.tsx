import * as React from 'react';
import CrossIcon from 'components/Icons/CrossIcon';
import SearchIcon from 'components/Icons/SearchIcon';
import SettingIcon from 'components/Icons/SettingIcon';
import ToggleIcon from 'components/Icons/ToggleIcon';
import style from './filter-popup.module.scss';

const FilterPopup = ({
    className = '',
    isOpen = false,
    closeFilter,
    changeFilters = function () {
        // do nothing
    }
}: {
    className?: string,
    isOpen?: boolean,
    closeFilter?: () => void,
    changeFilters?: (filters: any[]) => void
}) => {

    // tmp var
    const selectedFilters = [
        {
            name: 'Hat',
            value: 'hat',
            number: 3
        }
    ];

    return (
        <div className={style.popup + ' ' + className + ' ' + (isOpen ? style.open : style.close)}>
            <div className={style.close} onClick={closeFilter}>
                <CrossIcon />
            </div>
            <div className={style.content}>
                <header>
                    <h2>Properties</h2>
                    <div className={style['search-bar']}>
                        <SearchIcon />
                        <input type="text" placeholder="Search..." />
                    </div>
                </header>
                <div className={style.list}>
                    <ItemList title='Background' icon='/background_icon.png' />
                    <ItemList title='Hats' icon='/hat_icon.png' />
                    <ItemList title='Eyes' icon='/eyes_icon.png' />
                    <ItemList title='Beack' icon='/beack_icon.png' />
                    <ItemList title='Clothes' icon='/clothes_icon.png' />
                    <ItemList title='Weapons' icon='/weapons_icon.png' />
                </div>
                <div className={style.control}>
                    <button onClick={() => changeFilters([])}>Clear All</button>
                    <button className={style.filled} onClick={() => changeFilters(selectedFilters)}>Apply</button>
                </div>
            </div>
        </div>
    );
};

export default FilterPopup;



const ItemList = ({
    className = '',
    isOpen = false,
    icon,
    title
}: {
    className?: string,
    isOpen?: boolean,
    icon: string,
    title: string,
}) => {
    return (
        <div className={style['item-list'] + ' ' + className + ' ' + (isOpen ? style.open : style.close)}>
            <div className={style.icon}>
                <img src={icon} alt={title} />
            </div>
            <div className={style.name}>{title}</div>
            <div className={style.toggle}>
                <ToggleIcon />
            </div>
        </div>
    );
};