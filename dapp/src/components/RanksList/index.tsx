import React from 'react';
import { ElementType } from '@apcolony/marketplace-api';

interface Props {
    category: ElementType;
}

export const RanksList = ({ category }: Props) => {
    return <div>
        RanksList {category}
    </div>;
}