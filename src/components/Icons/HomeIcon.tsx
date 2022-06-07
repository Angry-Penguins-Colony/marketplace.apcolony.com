import React from 'react';

const HomeIcon = ({
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
                    ? <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 21.53 21.915" className={'icon ' + className} fill={fill}>
                        <path id="Tracé_208" data-name="Tracé 208" d="M21.53,9.971V18.3a3.619,3.619,0,0,1-3.615,3.615H3.615A3.619,3.619,0,0,1,0,18.3V9.971a3.619,3.619,0,0,1,1.213-2.7L8.363.913a3.616,3.616,0,0,1,4.8,0l7.15,6.355a3.619,3.619,0,0,1,1.213,2.7" transform="translate(0 0)" />
                    </svg>
                    : <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 21.53 21.915" className={'icon ' + className} fill={fill} >
                        <path id="Tracé_197" data-name="Tracé 197" d="M17.915,21.915H3.615A3.619,3.619,0,0,1,0,18.3V9.971a3.618,3.618,0,0,1,1.213-2.7L8.363.913a3.616,3.616,0,0,1,4.8,0l7.15,6.355a3.618,3.618,0,0,1,1.213,2.7V18.3a3.619,3.619,0,0,1-3.615,3.615m-7.15-19.5a1.2,1.2,0,0,0-.8.3L2.815,9.07a1.206,1.206,0,0,0-.4.9V18.3a1.206,1.206,0,0,0,1.205,1.205h14.3A1.206,1.206,0,0,0,19.12,18.3V9.971a1.206,1.206,0,0,0-.4-.9l-7.15-6.355a1.2,1.2,0,0,0-.8-.3" />
                    </svg >
            }
        </>
    );
};

export default HomeIcon;
