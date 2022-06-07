import React from 'react';

const KebabIcon = ({
    className = '',
    fill
}: {
    className?: string,
    fill?: string;
}) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 5.969 23.878" className={'icon ' + className} fill={fill}>
            <path id="Tracé_315" data-name="Tracé 315" d="M0,272.984a2.985,2.985,0,1,1,2.985,2.985A2.985,2.985,0,0,1,0,272.984" transform="translate(0 -261.045)" />
            <path id="Tracé_316" data-name="Tracé 316" d="M0,2.985A2.985,2.985,0,1,1,2.985,5.969,2.985,2.985,0,0,1,0,2.985" />
            <path id="Tracé_317" data-name="Tracé 317" d="M0,542.984a2.985,2.985,0,1,1,2.985,2.985A2.985,2.985,0,0,1,0,542.984" transform="translate(0 -522.091)" />
        </svg>

    );
};

export default KebabIcon;
