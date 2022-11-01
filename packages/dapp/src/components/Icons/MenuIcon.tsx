import React from 'react';

const MenuIcon = ({
    className = '',
    fill
}: {
    className?: string,
    fill?: string;
}) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20.794 17.87" className={'icon ' + className} fill={fill}>
            <path id="Tracé_202" data-name="Tracé 202" d="M19.17,3.249H1.625A1.625,1.625,0,0,1,1.625,0H19.17a1.625,1.625,0,0,1,0,3.249" />
            <path id="Tracé_203" data-name="Tracé 203" d="M19.17,115.749H1.625a1.625,1.625,0,0,1,0-3.249H19.17a1.625,1.625,0,0,1,0,3.249" transform="translate(0 -105.189)" />
            <path id="Tracé_204" data-name="Tracé 204" d="M19.17,228.249H1.625a1.625,1.625,0,0,1,0-3.249H19.17a1.625,1.625,0,0,1,0,3.249" transform="translate(0 -210.379)" />
        </svg>
    );
};

export default MenuIcon;
