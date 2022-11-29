import React from 'react';
import { IItem } from '@apcolony/marketplace-api';
import { FormGroup } from 'react-bootstrap';
import FormCheckInput from 'react-bootstrap/esm/FormCheckInput';
import FormCheckLabel from 'react-bootstrap/esm/FormCheckLabel';
import { stakePointsToTier } from 'sdk/utils';
import { GenericFilterProps } from 'systems/filters/popup/GenericFiltersPopup';
import style from './index.module.scss';

type Props = GenericFilterProps<IItem>


export const ItemsTier = ({
    elements: items,
    onFilterUpdate
}: Props) => {

    const tiers = [
        'Bronze',
        'Silver',
        'Gold',
        'Diamond'
    ];

    const [selectedTiers, setSelectedTiers] = React.useState<string[]>([]);

    React.useEffect(() => {

        onFilterUpdate({
            badgePillLabel: selectedTiers,
            applyFilter: (_items: IItem[]) => {
                return _items
                    .filter(item => {
                        if (selectedTiers.length == 0) {
                            return true;
                        }
                        else {
                            const tier = stakePointsToTier(item.stakePoints);

                            return selectedTiers.includes(tier);
                        }
                    })
            }
        })
    }, [selectedTiers]);

    return <div className={style.itemsTier}>
        <h4>Items rarity</h4>
        {
            tiers.map(tier =>
                <FormGroup key={tier} className={style.form}>
                    <FormCheckInput name={tier} onChange={handleChange} />
                    <FormCheckLabel>
                        {tier} <span className="text-muted">({getTierCount(tier)})</span>
                    </FormCheckLabel>
                </FormGroup>
            )
        }
    </div>

    function getTierCount(tier: string) {
        return items.filter(item => stakePointsToTier(item.stakePoints) == tier).length;
    }

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { name, checked } = e.target;

        if (checked) {
            setSelectedTiers([...selectedTiers, name]);
        } else {
            setSelectedTiers(selectedTiers.filter(tier => tier !== name));
        }
    }
}