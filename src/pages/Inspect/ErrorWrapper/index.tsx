import React from 'react';
import { useParams } from 'react-router-dom';
import UnknownIdInspectError from 'pages/Errors/Inspect/UnknownId';
import { isIdValid } from 'sdk/misc/isIdValid';
import CategoriesType from 'sdk/types/CategoriesType';
import Inspect from '..';

const InspectErrorWrapper = () => {

    const params = useParams();
    const category = params.type as CategoriesType;
    const id = params.id;

    if (!category) throw new Error('type is required');
    if (!id) throw new Error('Item id is required');

    if (isIdValid(id, category)) {
        return <Inspect />
    }
    else {
        return <UnknownIdInspectError />
    }

};

export default InspectErrorWrapper;