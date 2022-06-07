import React from 'react';

const DefaultIcon = ({
    className = '',
    fill
}: {
    className?: string,
    fill?: string;
}) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox='6 6 36 36' className={'icon ' + className} fill={fill}><path d="M9 42Q7.8 42 6.9 41.1Q6 40.2 6 39V9Q6 7.8 6.9 6.9Q7.8 6 9 6H39Q40.2 6 41.1 6.9Q42 7.8 42 9V39Q42 40.2 41.1 41.1Q40.2 42 39 42ZM14.5 21.5H21.5V14.5H14.5ZM26.5 21.5H33.5V14.5H26.5ZM14.5 33.5H21.5V26.5H14.5ZM26.5 33.5H33.5V26.5H26.5Z" /></svg>
    );
};

export default DefaultIcon;
