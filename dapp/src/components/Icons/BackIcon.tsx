import React from 'react';

const BackIcon = ({
    className = '',
    onClick = () => { },
    fill
}: {
    className?: string,
    fill?: string;
    onClick?: () => void,
}) => {
    return (
        <svg onClick={onClick} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15.496 24.545" className={'icon ' + className} fill={fill}>
            <path id="Tracé_272" data-name="Tracé 272" d="M12.6.422.8,10.542A2.279,2.279,0,0,0,.8,14L12.6,24.122a1.753,1.753,0,1,0,2.282-2.662L4.165,12.272,14.884,3.084A1.753,1.753,0,1,0,12.6.422" />
        </svg>

    );
};

export default BackIcon;
