import { IItem, IPenguin } from '@apcolony/marketplace-api';

export function stakePointsToTier(stakePoints: number): string {
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

export function getStakePointsSum(penguin: IPenguin) {
    return Object.values(penguin.equippedItems)
        .reduce((acc: number, item: IItem) => acc + item.stakePoints, 0);
}