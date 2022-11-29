import React from 'react';
import { IPenguin } from '@apcolony/marketplace-api';
import { FormGroup, FormLabel, FormControl } from 'react-bootstrap'
import { stakeTokenName } from 'config';
import { getStakePointsSum } from 'sdk/utils';
import { GenericFilterProps } from 'systems/filters/popup/GenericFiltersPopup';

type Props = GenericFilterProps<IPenguin>

interface MinMax {
    min?: number;
    max?: number;
}

export const StakePointsFilter = ({
    elements: penguins,
    onFilterUpdate
}: Props) => {

    const [stakePoints, setStakePoints] = React.useState<MinMax>({});


    React.useEffect(() => {
        const rawPillLabel = getBadgePillLabel()

        onFilterUpdate({
            badgePillLabel: rawPillLabel ? [stakeTokenName + ' ' + rawPillLabel] : [],
            applyFilter: () => {

                if (stakePoints.min == undefined && stakePoints.max == undefined) {
                    return penguins;
                }
                else {
                    return penguins.filter(penguin => {

                        const penguinStakePoints = getStakePointsSum(penguin);

                        if (stakePoints.min && stakePoints.max) {
                            return penguinStakePoints >= stakePoints.min && penguinStakePoints <= stakePoints.max;
                        }
                        else if (stakePoints.min) {
                            return penguinStakePoints >= stakePoints.min;
                        }
                        else if (stakePoints.max) {
                            return penguinStakePoints <= stakePoints.max;
                        }
                    });
                }
            }
        })

        function getBadgePillLabel(): string | undefined {

            if (stakePoints.min && stakePoints.max) {
                return `${stakePoints.min} - ${stakePoints.max}`;
            }
            else if (stakePoints.min) {
                return `>= ${stakePoints.min}`;
            }
            else if (stakePoints.max) {
                return `<= ${stakePoints.max}`;
            }
            else {
                return undefined;
            }
        }
    }, [stakePoints]);

    return <FormGroup>
        <FormLabel>{stakeTokenName} Generated</FormLabel>
        <div>
            <FormControl
                type="number"
                placeholder="Min"
                min="0"
                name="min"
                max={stakePoints?.max}
                value={stakePoints?.min}
                onChange={handleChange}
            />
            <FormControl
                type="number"
                placeholder="Max"
                name="max"
                min={stakePoints?.min ?? '0'}
                value={stakePoints?.max}
                onChange={handleChange}
            />
        </div>
    </FormGroup>;

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { name } = e.target;

        setStakePoints({
            ...stakePoints,
            [name]: e.target.value ? parseInt(e.target.value) : undefined
        });
    }
}