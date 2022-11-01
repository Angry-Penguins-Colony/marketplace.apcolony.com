import React from 'react';

const SearchIcon = ({
    className = '',
    fill
}: {
    className?: string,
    fill?: string;
}) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 17.531 17.321" className={'icon ' + className} fill={fill}>
            <path d="M17.224,15.53l-4.3-4.3a7.13,7.13,0,1,0-1.452,1.513l4.27,4.27a1.048,1.048,0,0,0,1.483-1.483M2.1,7.116a5.02,5.02,0,1,1,5.02,5.02A5.026,5.026,0,0,1,2.1,7.116" />
        </svg>
    );
};

export default SearchIcon;
