import React from 'react';

const CheckIcon = ({
    className = '',
    fill
}: {
    className?: string,
    fill?: string;
}) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16.273 11.452" className={'icon ' + className} fill={fill}>
            <path d="M15.946.326a1.115,1.115,0,0,0-1.576,0L5.935,8.761,1.9,4.728A1.115,1.115,0,0,0,.326,6.3l4.821,4.821a1.115,1.115,0,0,0,1.576,0L15.946,1.9a1.115,1.115,0,0,0,0-1.576" />
        </svg>

    );
};

export default CheckIcon;
