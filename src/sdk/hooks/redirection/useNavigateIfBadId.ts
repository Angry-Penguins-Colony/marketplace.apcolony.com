import { useNavigate } from 'react-router-dom';
import CategoriesType from 'sdk/types/CategoriesType';
import { isIdValid } from '../../misc/isIdValid';

export function useNavigateIfBadId(id: string, category: CategoriesType, errorPage: string) {

    const navigate = useNavigate();

    if (isIdValid(id, category) == false) {
        console.log('navigate');
        navigate(errorPage, { replace: true });
    }
}

