import React from 'react';

const CrossIcon = ({
    className = '',
    fill
}: {
    className?: string,
    fill?: string;
}) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8.655 8.655" className={'icon ' + className} fill={fill}>
            <path d="M136.464,137.373a.908.908,0,0,1-.644-.267l-2.773-2.774-2.773,2.774a.91.91,0,1,1-1.287-1.287l2.774-2.773-2.774-2.774a.91.91,0,0,1,1.287-1.287l2.773,2.774,2.773-2.774a.91.91,0,0,1,1.287,1.287l-2.773,2.774,2.773,2.773a.91.91,0,0,1-.644,1.554" transform="translate(-128.719 -128.718)" />
        </svg>


    );
};

export default CrossIcon;
