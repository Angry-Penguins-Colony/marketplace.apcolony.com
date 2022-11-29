import React from 'react';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Badge } from 'react-bootstrap';
import Button from 'components/Abstract/Button/Button';
import Popup from 'components/Foreground/Popup/Generic/Popup';
import { IFilter } from 'systems/filters/types/interface';
import style from './index.module.scss';

export interface GenericFilterProps<T> {
    items: T[];
    onFilterUpdate: (newFilter: IFilter<T>) => void;
}

export interface GenericFiltersPopupProps<T> {
    elements: T[];
    onFilterChanged?: (elements: T[]) => void;
    filters: ((props: GenericFilterProps<T>) => JSX.Element)[]
}

export const GenericFiltersPopup = <T extends unknown>({
    elements,
    filters,
    onFilterChanged = () => { }
}: GenericFiltersPopupProps<T>) => {


    const [filterOpen, setFilterOpen] = React.useState(false);

    const [activeFilter, setActiveFilter] = React.useState<IFilter<T> | undefined>();

    React.useEffect(() => {
        if (activeFilter) {
            onFilterChanged(activeFilter.applyFilter(elements));
        }
    }, [activeFilter]);

    return <>
        <Popup
            isVisible={filterOpen}
            onCloseClicked={() => setFilterOpen(false)}
            contentClassName={style.popup}
        >
            <h2>Filters</h2>
            {filters.map(f => f({ items: elements, onFilterUpdate: setActiveFilter }))}

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