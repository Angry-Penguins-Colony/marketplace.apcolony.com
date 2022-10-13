import * as React from 'react';
import ErrorPage from 'components/ErrorPage';

const NoPenguinCustomizeError = () => {

    return <ErrorPage
        title='No penguin to customize'
        description="Sorry, you don't have any penguin to customize."
    />
};

export default NoPenguinCustomizeError;
