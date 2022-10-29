import React from 'react';

const SettingIcon = ({
    className = '',
    fill
}: {
    className?: string,
    fill?: string;
}) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12.353 9.452" stroke={fill} className={'icon ' + className}>
            <g transform="translate(-16.875 -12.5)">
                <line x2="2.212" transform="translate(17.5 20.056)" fill="none" stroke={fill} strokeLinecap="round" strokeMiterlimit="10" strokeWidth="1.25" />
                <line x2="5.41" transform="translate(23.193 20.056)" fill="none" stroke={fill} strokeLinecap="round" strokeMiterlimit="10" strokeWidth="1.25" />
                <circle cx="1.396" cy="1.396" r="1.396" transform="translate(20.116 18.66)" fill="none" stroke={fill} strokeLinecap="round" strokeMiterlimit="10" strokeWidth="1" />
                <line x1="2.212" transform="translate(26.39 14.396)" fill="none" stroke={fill} strokeLinecap="round" strokeMiterlimit="10" strokeWidth="1.25" />
                <line x1="5.41" transform="translate(17.5 14.396)" fill="none" stroke={fill} strokeLinecap="round" strokeMiterlimit="10" strokeWidth="1.25" />
                <ellipse cx="1.396" cy="1.396" rx="1.396" ry="1.396" transform="translate(23.195 13)" fill="none" stroke={fill} strokeLinecap="round" strokeMiterlimit="10" strokeWidth="1" />
            </g>
        </svg>


    );
};

export default SettingIcon;
