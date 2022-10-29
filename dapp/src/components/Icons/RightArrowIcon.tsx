import React from 'react';

const RightArrowIcon = ({
    className = '',
    fill
}: {
    className?: string,
    fill?: string;
}) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12.281 19.998" className={'icon ' + className} fill={fill}>
            <path id="Right_arrow_path" d="M2.019,19.7l9.622-8.3a1.849,1.849,0,0,0,0-2.8L2.019.3A1.222,1.222,0,0,0,0,1.231V18.767a1.222,1.222,0,0,0,2.019.932" />
        </svg>
    );
};

export default RightArrowIcon;
