import React from 'react';
import ItemsInventory from 'components/Inventory/ItemsInventory/ItemsInventory';
import MobileHeader from 'components/Layout/MobileHeader/MobileHeader';
import { buildRouteLinks } from 'routes';
import { useGetOwnedPenguins } from 'sdk/hooks/api/useGetOwned';
import style from './index.module.scss';

const SelectCustomizePenguin = () => {

    const penguins = useGetOwnedPenguins();

    React.useEffect(() => {
        // add class to body element for no footer
        document.body.classList.add('no-footer');
        document.body.classList.add('no-scroll');
        document.body.classList.add('background-image');
    }, []);

    return <>
        <MobileHeader title="Select a penguin to customize" className={style['mobile-header']} />
        <div id={style.root}>
            <header>
                <h2>Select a penguin to customize</h2>
            </header>

            <ItemsInventory
                className={style['items-inventory']}
                contentClassName={style['items-inventory-content']}
                items={penguins}
                type='penguins'
                hasFilter={false}
                buildLink={(item) => buildRouteLinks.customize(item.id)}
                loadingColor="text-light"
            />
        </div>
    </>
};

export default SelectCustomizePenguin;