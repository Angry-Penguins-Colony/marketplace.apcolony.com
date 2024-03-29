import React from 'react';

const TwitterIcon = ({
    className = '',
    fill
}: {
    className?: string,
    fill?: string;
}) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 11" className={'icon ' + className} fill={fill}>
            <path d="M544.584,580.85a7.976,7.976,0,0,0,8.172-7.9c0-.12,0-.24-.008-.359a5.736,5.736,0,0,0,1.433-1.438,5.879,5.879,0,0,1-1.649.437,2.805,2.805,0,0,0,1.263-1.536,5.879,5.879,0,0,1-1.824.674,2.916,2.916,0,0,0-2.1-.877A2.826,2.826,0,0,0,547,572.626a2.686,2.686,0,0,0,.075.633,8.252,8.252,0,0,1-5.921-2.9,2.7,2.7,0,0,0-.389,1.4,2.752,2.752,0,0,0,1.278,2.311,2.926,2.926,0,0,1-1.3-.347c0,.012,0,.023,0,.035a2.8,2.8,0,0,0,2.3,2.722,2.962,2.962,0,0,1-1.3.048,2.865,2.865,0,0,0,2.683,1.929,5.889,5.889,0,0,1-3.567,1.189,6.02,6.02,0,0,1-.685-.038,8.335,8.335,0,0,0,4.4,1.247" transform="translate(-540.181 -569.85)" />
        </svg>
    );
};

export default TwitterIcon;
