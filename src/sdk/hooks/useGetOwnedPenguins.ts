import IPenguin from 'sdk/IPenguin';
import { placeholdersPenguins } from 'sdk/placeholders/placeholders';


export default function useGetOwnedPenguins(): IPenguin[] {
    return [
        placeholdersPenguins[4987],
        placeholdersPenguins[4782],
        placeholdersPenguins[1155],
    ];
}