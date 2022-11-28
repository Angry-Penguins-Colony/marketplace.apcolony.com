import React from 'react';
import { IItem } from '@apcolony/marketplace-api';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Badge, FormGroup } from 'react-bootstrap';
import FormCheckInput from 'react-bootstrap/esm/FormCheckInput';
import FormCheckLabel from 'react-bootstrap/esm/FormCheckLabel';
import Button from 'components/Abstract/Button/Button';
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
    const [selectedTiers, setSelectedTiers] = React.useState<string[]>([]);

    return <>
        <Popup
            isVisible={filterOpen}
            onCloseClicked={() => setFilterOpen(false)}
        >
            <ItemsTier onTierSelected={handleTierSelected} items={items} />

            <Button onClick={() => setFilterOpen(false)}>
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
                    selectedTiers
                        .map(tier => <Badge key={tier} bg="secondary" text="white" pill>{tier}</Badge>)
                }
            </div>

        </div>
    </>;

    function handleTierSelected(tiers: string[]) {

        setSelectedTiers(tiers);

        const filteredItems = items
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
    items: IItem[],
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
                        {tier} <span className="text-muted">({getTierCount(tier)})</span>
                    </FormCheckLabel>
                </FormGroup>
            )
        }
    </>

    function getTierCount(tier: string) {
        return props.items.filter(item => stakePointsToTier(item.stakePoints) == tier).length;
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