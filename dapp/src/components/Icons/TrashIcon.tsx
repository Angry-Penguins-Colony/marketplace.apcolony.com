import React from 'react';

const TrashIcon = ({
    className = '',
    strokeWidth = 200,
    fill
}: {
    className?: string,
    strokeWidth?: number,
    fill?: string;
}) => {

    const svgProps = {
        fill,
        stroke: fill,
        strokeWidth
    };


    return (
        <svg xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512.000000 512.000000"
            className={'icon ' + className} fill={fill}>

            <g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"
                {...svgProps}>
                <path {...svgProps} d="M2045 4673 c-164 -86 -166 -300 -3 -384 35 -18 64 -19 515 -19 444 0
        481 2 518 19 164 76 166 298 3 382 -35 18 -64 19 -520 19 -420 -1 -487 -3
        -513 -17z" transform='translate(0,256)' />
                <path {...svgProps} d="M539 4027 c-24 -13 -57 -43 -74 -66 -27 -39 -30 -50 -30 -120 0 -68
        3 -82 27 -117 15 -21 44 -50 65 -64 36 -25 40 -25 287 -30 l251 -5 5 -1350 5
        -1350 26 -67 c77 -198 225 -341 414 -401 l70 -22 975 0 975 0 70 22 c194 62
        351 217 418 413 l22 65 5 1345 5 1345 251 5 c247 5 251 5 287 30 21 14 50 43
        65 64 24 35 27 49 27 116 0 67 -3 81 -27 116 -15 21 -44 50 -65 64 l-37 25
        -1986 3 -1987 2 -44 -23z m3089 -1677 c2 -939 0 -1289 -9 -1329 -15 -71 -82
        -142 -151 -159 -67 -17 -1749 -17 -1816 0 -64 16 -134 86 -150 150 -9 35 -12
        380 -12 1326 0 703 3 1282 7 1285 3 4 484 6 1067 5 l1061 -3 3 -1275z"/>
            </g>
        </svg>



    );
};

export default TrashIcon;
