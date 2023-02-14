import React from 'react';
import MobileHeader from 'components/Layout/MobileHeader/MobileHeader';
import useGetAllDrops from 'sdk/hooks/api/useGetAllDrops';

export const DropsList = () => {
    const { data: dropsList } = useGetAllDrops();

    return <>
        <MobileHeader title={'Drops List'} type='light' />


    </>;
}