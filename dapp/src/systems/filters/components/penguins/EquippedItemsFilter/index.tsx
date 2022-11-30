import React from 'react';
import { IPenguin } from '@apcolony/marketplace-api';
import { capitalize } from 'lodash';
import { GenericFilterProps } from 'systems/filters/popup/GenericFiltersPopup';
import style from './index.module.scss';
import { SlotItemsSelector } from './subcomponents/SlotItemsSelector';

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

    return <div className={style.selectorContainer}>
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