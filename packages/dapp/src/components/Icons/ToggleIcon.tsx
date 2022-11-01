import React from 'react';

const ToggleIcon = ({
    className = '',
    fill
}: {
    className?: string,
    fill?: string;
}) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15.168 10.084" className={'icon ' + className} fill={fill}>
            <path d="M8.426.227l-7.9,6.3a1.334,1.334,0,0,0,0,2.121l7.9,6.3a1.013,1.013,0,0,0,1.658-.707V.934A1.013,1.013,0,0,0,8.426.227" transform="translate(0 10.084) rotate(-90)" />
        </svg>
    );
};

export default ToggleIcon;
