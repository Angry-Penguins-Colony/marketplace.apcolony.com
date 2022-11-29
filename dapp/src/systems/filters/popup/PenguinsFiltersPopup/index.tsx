import React from 'react';
import { IPenguin } from '@apcolony/marketplace-api';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormControl, FormGroup, FormLabel } from 'react-bootstrap';
import Button from 'components/Abstract/Button/Button';
import Popup from 'components/Foreground/Popup/Generic/Popup';
import style from './index.module.scss';

interface Props {
    penguins: IPenguin[];
    onFilterChanged?: (filter: IPenguin[]) => void;
}

export const PenguinsFiltersPopup = ({
}: Props) => {


    const [filterOpen, setFilterOpen] = React.useState(true);

    return <>
        <Popup
            isVisible={filterOpen}
            onCloseClicked={() => setFilterOpen(false)}
            contentClassName={style.popup}
        >
            <h2>Filters</h2>

            <div className={style.filters}>

                <FormGroup>
                    <FormLabel htmlFor='price'>Price</FormLabel>
                    <div className={style.sideBySide}>
                        <FormControl type="number" placeholder="Min" />
                        <FormControl type="number" placeholder="Max" />
                    </div>
                </FormGroup>
            </div>

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