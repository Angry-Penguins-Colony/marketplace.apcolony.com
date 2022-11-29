import React from 'react';
import { IItem } from '@apcolony/marketplace-api';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Badge } from 'react-bootstrap';
import Button from 'components/Abstract/Button/Button';
import { IFilter } from 'components/Filters/interface';
import { ItemsTier } from 'components/Filters/ItemsTier';
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

    const [activeFilter, setActiveFilter] = React.useState<IFilter<IItem> | undefined>();

    React.useEffect(() => {
        if (activeFilter) {
            onFilterChanged(activeFilter.applyFilter(items));
        }
    }, [activeFilter]);

    return <>
        <Popup
            isVisible={filterOpen}
            onCloseClicked={() => setFilterOpen(false)}
            contentClassName={style.popup}
        >
            <h2>Filters</h2>
            <ItemsTier onFilterUpdate={setActiveFilter} items={items} />

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
                    activeFilter && activeFilter.badgePillLabel
                        .map(label => <Badge key={label} bg="secondary" text="white" pill>{label}</Badge>)
                }
            </div>

        </div>
    </>;
}