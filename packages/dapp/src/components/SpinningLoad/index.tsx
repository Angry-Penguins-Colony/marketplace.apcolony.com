import React from 'react';

const SpinningLoad = () => {
    return <div className="d-flex w-100 justify-content-center mt-2">
        <div className="spinner-border" role="status">
            <span className="sr-only">Loading...</span>
        </div>
    </div>;
};

export default SpinningLoad;