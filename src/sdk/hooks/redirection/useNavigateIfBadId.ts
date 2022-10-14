import { useNavigate } from 'react-router-dom';
import { items, penguinsCount } from 'config';
import CategoriesType from 'sdk/types/CategoriesType';

export function useNavigateIfBadId(id: string, category: CategoriesType, errorPage: string) {

    const navigate = useNavigate();

    if (isIdValid(id, category) == false) {
        console.log('navigate');
        navigate(errorPage, { replace: true });
    }
}

function isIdValid(rawId: string, category: CategoriesType): boolean {

    switch (category) {
        case 'items':
            return items.some(item => item.id == rawId);

        case 'penguins':
            const id = parseInt(rawId);
            return isNaN(id) == false && id > 0 && id <= penguinsCount;

        default:
            throw new Error('Unknown type');
    }
}