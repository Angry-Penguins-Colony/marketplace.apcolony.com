import React from 'react';

const ProfileIcon = ({
    className = '',
    fill,
    fulfill = false,
}: {
    className?: string,
    fill?: string,
    fulfill?: boolean,
}) => {
    return (
        <>
            {
                fulfill
                    ? <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18.784 22.496" className={'icon ' + className} fill={fill}>
                        <path id="Tracé_218" data-name="Tracé 218" d="M18.784,214.9v3.134a2.3,2.3,0,0,1-2.3,2.3H2.3a2.3,2.3,0,0,1-2.3-2.3V214.9a6.4,6.4,0,0,1,6.394-6.394h6a6.4,6.4,0,0,1,6.394,6.394" transform="translate(0 -197.844)" />
                        <path id="Tracé_219" data-name="Tracé 219" d="M96.031,4.99A4.99,4.99,0,1,1,91.04,0a5,5,0,0,1,4.99,4.99" transform="translate(-81.648)" />
                    </svg>
                    : <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18.785 22.497" className={'icon ' + className} fill={fill}>
                        <path id="Tracé_200" data-name="Tracé 200" d="M16.483,220.342H2.3a2.3,2.3,0,0,1-2.3-2.3v-3.134a6.4,6.4,0,0,1,6.394-6.394h6a6.4,6.4,0,0,1,6.394,6.394v3.134a2.3,2.3,0,0,1-2.3,2.3M2.558,217.785h13.67v-2.878a3.841,3.841,0,0,0-3.837-3.837h-6a3.841,3.841,0,0,0-3.837,3.837Z" transform="translate(0 -197.846)" />
                        <path id="Tracé_201" data-name="Tracé 201" d="M91.038,9.982a4.991,4.991,0,1,1,4.991-4.991,5,5,0,0,1-4.991,4.991m0-7.424a2.433,2.433,0,1,0,2.433,2.433,2.436,2.436,0,0,0-2.433-2.433" transform="translate(-81.646)" />
                    </svg>
            }
        </>
    );
};

export default ProfileIcon;
