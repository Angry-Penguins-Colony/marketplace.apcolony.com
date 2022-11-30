import React from 'react';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { capitalize } from 'lodash';
import { Collapse, FormGroup } from 'react-bootstrap';
import FormCheckInput from 'react-bootstrap/esm/FormCheckInput';
import FormCheckLabel from 'react-bootstrap/esm/FormCheckLabel';
import style from './index.module.scss';

export const SlotItemsSelector = ({
    items,
    slot,
    onSelectionUpdate
}: {
    items: string[],
    slot: string,
    onSelectionUpdate: (selected: string[]) => void
}) => {

    const [open, setOpen] = React.useState(false);
    const [selected, setSelected] = React.useState<string[]>([]);

    React.useEffect(() => {
        onSelectionUpdate(selected);
    }, [selected])

    return <>
        <div
            onClick={() => setOpen(!open)}
            aria-controls="example-collapse-text"
            aria-expanded={open}
            className={style.collapseHeader}
        >
            {capitalize(slot)}
            <FontAwesomeIcon icon={faChevronDown} />
        </div>
        <Collapse in={open}>
            <div id="example-collapse-text">
                {
                    items.map(item => {
                        return <FormGroup key={item} >
                            <FormCheckInput name={item} onChange={handleChange} />
                            <FormCheckLabel>
                                {item}
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