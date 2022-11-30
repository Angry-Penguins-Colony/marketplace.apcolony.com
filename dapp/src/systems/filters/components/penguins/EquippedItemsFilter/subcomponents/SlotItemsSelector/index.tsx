import React from 'react';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { capitalize } from 'lodash';
import { Collapse, FormGroup } from 'react-bootstrap';
import FormCheckLabel from 'react-bootstrap/esm/FormCheckLabel';
import style from './index.module.scss';

export const SlotItemsSelector = ({
    items,
    slot,
    onSelectionUpdate
}: {
    items: {
        name: string;
        amount: number
    }[],
    slot: string,
    onSelectionUpdate: (selected: string[]) => void
}) => {

    const [open, setOpen] = React.useState(false);
    const [selected, setSelected] = React.useState<string[]>([]);

    React.useEffect(() => {
        onSelectionUpdate(selected);
    }, [selected])

    const collapseId = 'collapse' + slot;
    return <>
        <div
            onClick={() => setOpen(!open)}
            aria-controls={collapseId}
            aria-expanded={open}
            className={style.collapseHeader}
        >
            {capitalize(slot)}
            <FontAwesomeIcon icon={open ? faChevronUp : faChevronDown} />
        </div>
        <Collapse in={open} >
            <div id={collapseId} className={style.collapseContainer}>
                {
                    items.map(item => {
                        return <FormGroup key={item.name} className={style.collapse} >
                            <input className="float-right" type="checkbox" name={item.name} onChange={handleChange} />
                            <FormCheckLabel>
                                {item.name} <span className="text-muted">({item.amount})</span>
                            </FormCheckLabel>
                        </FormGroup>
                    })
                }
            </div>
        </Collapse>
    </>

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { name, checked } = e.target;

        if (checked) {
            setSelected([...selected, name]);
        } else {
            setSelected(selected.filter(tier => tier !== name));
        }
    }
}