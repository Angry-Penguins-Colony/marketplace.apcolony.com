import React from 'react';

const SortIcon = ({
    className = '',
    fill
}: {
    className?: string,
    fill?: string;
}) => {
    return (
        <svg id="Groupe_823" data-name="Groupe 823" xmlns="http://www.w3.org/2000/svg" width="10.188" height="10.188" viewBox="0 0 10.188 10.188" className={'icon ' + className} fill={fill}>
            <path d="M3.79.857h0V3.791H.856V.857ZM3.79,0H.856A.857.857,0,0,0,0,.857V3.791a.857.857,0,0,0,.857.857H3.79a.857.857,0,0,0,.857-.857V.857A.857.857,0,0,0,3.79,0" transform="translate(0.001 0)" />
            <path d="M202.71.857h0V3.791h-2.934V.857Zm0-.857h-2.934a.857.857,0,0,0-.857.857V3.791a.857.857,0,0,0,.857.857h2.934a.857.857,0,0,0,.857-.857V.857A.857.857,0,0,0,202.71,0" transform="translate(-193.378 0)" />
            <path d="M3.79,199.777h0v2.934H.856v-2.934Zm0-.857H.856a.857.857,0,0,0-.857.857v2.934a.857.857,0,0,0,.857.857H3.79a.857.857,0,0,0,.857-.857v-2.934a.857.857,0,0,0-.857-.857" transform="translate(0.001 -193.379)" />
            <path d="M202.71,199.777v2.934h-2.934v-2.934Zm0-.857h-2.934a.857.857,0,0,0-.857.857v2.934a.857.857,0,0,0,.857.857h2.934a.857.857,0,0,0,.857-.857v-2.934a.857.857,0,0,0-.857-.857" transform="translate(-193.378 -193.379)" />
        </svg>


    );
};

export default SortIcon;
