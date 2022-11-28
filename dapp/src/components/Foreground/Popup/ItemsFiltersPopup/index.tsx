import React from 'react';
import { IItem } from '@apcolony/marketplace-api';
import { Button, FormGroup } from 'react-bootstrap';
import FormCheckInput from 'react-bootstrap/esm/FormCheckInput';
import FormCheckLabel from 'react-bootstrap/esm/FormCheckLabel';
import Popup, { IPopupProps } from '../Generic/Popup';

interface Props extends IPopupProps {
    items: IItem[];
    onFilterChanged?: (filter: IItem[]) => void;
}

export const ItemsFiltersPopup = (props: Props) => {

    const {
        onCloseClicked = () => { },
        onFilterChanged = () => { }
    } = props;

    return <Popup {...props}>
        <ItemsTier onTierSelected={handleTierSelected} />

        <Button onClick={onCloseClicked}>
            Ok
        </Button>
    </Popup >;

    function handleTierSelected(tiers: string[]) {

        const filteredItems = props.items
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

const ItemsTier = (props: {
    onTierSelected: (tiers: string[]) => void
}) => {

    const tiers = [
        'Bronze',
        'Silver',
        'Gold',
        'Diamond'
    ];

    const [selectedTiers, setSelectedTiers] = React.useState<string[]>([]);

    React.useEffect(() => {
        props.onTierSelected(selectedTiers);
    }, [selectedTiers]);

    return <>
        <h3>Items tier</h3>
        {
            tiers.map(tier =>
                <FormGroup key={tier}>
                    <FormCheckInput name={tier} onChange={handleChange} />
                    <FormCheckLabel>
                        {tier}
                    </FormCheckLabel>
                </FormGroup>
            )
        }
    </>

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { name, checked } = e.target;

        if (checked) {
            setSelectedTiers([...selectedTiers, name]);
        } else {
            setSelectedTiers(selectedTiers.filter(tier => tier !== name));
        }
    }
}

function stakePointsToTier(stakePoints: number): string {
    switch (stakePoints) {
        case 1:
            return 'Bronze';

        case 2:
            return 'Silver';

        case 3:
            return 'Gold';

        case 5:
            return 'Diamond';

        default:
            console.error('Invalid stake points' + stakePoints);
            return '';
    }
}