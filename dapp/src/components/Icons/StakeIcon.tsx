import React from 'react';

const StakeIcon = ({
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
            <path d="M12 17L9 20M12 17L15 20M12 17V12M12 17V21M12 7L9 4M12 7L15 4M12 7V12M12 7V3M12 12L7.66985 9.49995M12 12L16.3301 14.4999M12 12L7.66985 14.4999M12 12L16.3301 9.49995M16.3301 14.4999L17.4282 18.598M16.3301 14.4999L20.4282 13.4019M16.3301 14.4999L19.7943 16.5M7.66985 9.49995L3.57178 10.598M7.66985 9.49995L6.57178 5.40187M7.66985 9.49995L4.20581 7.5M16.3301 9.49995L20.4282 10.598M16.3301 9.49995L17.4282 5.40187M16.3301 9.49995L19.7943 7.5M7.66985 14.4999L6.57178 18.598M7.66985 14.4999L3.57178 13.4019M7.66985 14.4999L4.20581 16.5" stroke="#6689e3" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>

    );
};

export default StakeIcon;
