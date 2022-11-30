import React from 'react';
import { IPenguin } from '@apcolony/marketplace-api';
import { capitalize } from 'lodash';
import { FormGroup, Collapse, Button } from 'react-bootstrap'
import FormCheckInput from 'react-bootstrap/esm/FormCheckInput';
import FormCheckLabel from 'react-bootstrap/esm/FormCheckLabel';
import { GenericFilterProps } from 'systems/filters/popup/GenericFiltersPopup';

type Props = GenericFilterProps<IPenguin>

export const EquippedItemsFilter = ({
    elements: penguins,
    onFilterUpdate
}: Props) => {

    const equippedItems = React.useMemo(() => getEquipedItems(penguins), [penguins]);
    const [selectedItems, setSelectedItems] = React.useState<{ [slot: string]: string[] }>({});

    React.useEffect(() => {
        onFilterUpdate({
            applyFilter: (items: IPenguin[]) => {
                return items
                    .filter(penguin => {
                        return Object.keys(selectedItems).every(slot => {

                            if (selectedItems[slot].length === 0) return true;
                            if (!penguin.equippedItems[slot]) return false;

                            return selectedItems[slot]
                                .includes(penguin.equippedItems[slot].displayName);
                        })
                    });
            },
            badgePillLabel: getBadgePillLabels()

        })


        function getBadgePillLabels(): string[] {

            const badges = [];

            for (const slot in selectedItems) {

                if (selectedItems[slot].length === 0) continue;

                badges.push(`${capitalize(slot)}: ${selectedItems[slot].join(' or ')}`);
            }

            return badges;
        }

    }, [selectedItems]);

    return <div className="d-flex flex-column">
        {
            Object.keys(equippedItems).map((slot) => {
                return <SlotItemsSelector
                    key={slot}
                    slot={slot}
                    items={equippedItems[slot]}
                    onSelectionUpdate={(items) => {
                        setSelectedItems({
                            ...selectedItems,
                            [slot]: items
                        })
                    }}
                />
            })
        }
    </div>
}


const SlotItemsSelector = ({
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
        <Button
            onClick={() => setOpen(!open)}
            aria-controls="example-collapse-text"
            aria-expanded={open}
        >
            {slot}
        </Button>
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

function getEquipedItems(penguins: IPenguin[]): { [slot: string]: string[] } {

    const result: { [slot: string]: string[] } = {};

    for (const penguin of penguins) {
        for (const slot in penguin.equippedItems) {

            const item = penguin.equippedItems[slot];

            if (!result[slot]) {
                result[slot] = [];
            }

            if (!result[slot].includes(item.displayName)) {
                result[slot].push(item.displayName);
            }
        }
    }

    return result;
}