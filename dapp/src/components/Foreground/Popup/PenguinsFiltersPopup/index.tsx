import React from 'react';
import { IPenguin } from '@apcolony/marketplace-api';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from 'components/Abstract/Button/Button';
import Popup from '../Generic/Popup';
import style from './index.module.scss';

interface Props {
    penguins: IPenguin[];
    onFilterChanged?: (filter: IPenguin[]) => void;
}

export const PenguinsFiltersPopup = ({
}: Props) => {


    const [filterOpen, setFilterOpen] = React.useState(false);

    return <>
        <Popup
            isVisible={filterOpen}
            onCloseClicked={() => setFilterOpen(false)}
            contentClassName={style.popup}
        >
            <h2>Filters</h2>

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
        </div>
    </>;
}