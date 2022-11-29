import React from 'react';
import { IItem } from '@apcolony/marketplace-api';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Badge } from 'react-bootstrap';
import Button from 'components/Abstract/Button/Button';
import { ItemsTier } from 'components/Filters/ItemsTier';
import { stakePointsToTier } from 'sdk/utils';
import Popup from '../Generic/Popup';
import style from './index.module.scss';

interface Props {
    items: IItem[];
    onFilterChanged?: (filter: IItem[]) => void;
}

export const ItemsFiltersPopup = ({
    items,
    onFilterChanged = () => { }
}: Props) => {


    const [filterOpen, setFilterOpen] = React.useState(false);
    const [selectedTiers, setSelectedTiers] = React.useState<string[]>([]);

    return <>
        <Popup
            isVisible={filterOpen}
            onCloseClicked={() => setFilterOpen(false)}
            contentClassName={style.popup}
        >
            <h2>Filters</h2>
            <ItemsTier onTierSelected={handleTierSelected} items={items} />

            <Button onClick={() => setFilterOpen(false)} className="w-100">
                Ok
            </Button>
        </Popup >

        <div className="mb-3 d-flex align-items-center">

            <Button onClick={() => setFilterOpen(true)}>
                <FontAwesomeIcon icon={faFilter} />
                <span className='ml-2'>
                    Filters
                </span>
            </Button>


            <div className={'ml-2' + ' ' + style.selectedTiers}>

                {
                    selectedTiers
                        .map(tier => <Badge key={tier} bg="secondary" text="white" pill>{tier}</Badge>)
                }
            </div>

        </div>
    </>;

    function handleTierSelected(tiers: string[]) {

        setSelectedTiers(tiers);

        const filteredItems = items
            .filter(item => {

                if (tiers.length == 0) {
                    return true;
                }
                else {
                    const tier = stakePointsToTier(item.stakePoints);

                    return tiers.includes(tier);
                }
            });

        onFilterChanged(filteredItems);
    }
}