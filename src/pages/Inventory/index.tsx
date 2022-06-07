import * as React from 'react';
import BackIcon from 'components/Icons/BackIcon';
import KebabIcon from 'components/Icons/KebabIcon';
import style from './inventory.module.scss';

const Inventory = () => {

    return (
        <>
            <div id={style['mobile-header']}>
                <BackIcon className={style.icon} />
                <h1>My Inventory</h1>
                <KebabIcon className={style.icon} />
            </div>
            Inventory
        </>
    );
};

export default Inventory;
