import * as React from 'react';
import CrossIcon from 'components/Icons/CrossIcon';
import SettingIcon from 'components/Icons/SettingIcon';
import SortIcon from 'components/Icons/SortIcon';
import style from './nav-inventory.module.scss';

const NavInventory = ({
    className = ''
}: {
    className?: string
}) => {
    return (
        <div className={style.nav + ' ' + className}>
            <h2>Filters</h2>
            <div className={style.content}>
                <div className={style.sort}>
                    <SortIcon className={style['icon-sort']} />
                </div>
                <div className={style['select-filter'] + ' ' + style.filter}>
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
    );
};

export default NavInventory;
