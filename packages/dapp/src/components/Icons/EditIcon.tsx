import React from 'react';

const EditIcon = ({
    className = '',
    fill
}: {
    className?: string,
    fill?: string;
}) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 17.713 17.713" className={'icon ' + className} fill={fill}>
            <path d="M68.017,6.559l-.024.029L67,7.827a2.5,2.5,0,0,0-.2.264,3.461,3.461,0,0,0-2.855,3.037l-.166,1.56a2.228,2.228,0,0,0,2.451,2.465l1.562-.167h.007A3.506,3.506,0,0,0,69.864,14l.006-.006a3.509,3.509,0,0,0,.982-1.942c.068-.044.135-.091.2-.14l.011-.009,1.253-1,.03-.025a22.438,22.438,0,0,0,5.7-7.693l.009-.02a1.757,1.757,0,0,0-.392-1.942A1.777,1.777,0,0,0,75.743.833l-.035.015a22.556,22.556,0,0,0-7.691,5.711m.6,6.19a1.736,1.736,0,0,1-1.013.485l-1.558.166a.467.467,0,0,1-.514-.415.484.484,0,0,1,0-.107l.166-1.563A1.7,1.7,0,0,1,67.379,9.8h.135c.044,0,.089,0,.133,0h.009a1.714,1.714,0,0,1,.964.5l.019.019a1.613,1.613,0,0,1,.476.933,2.144,2.144,0,0,1,.017.252,1.761,1.761,0,0,1-.511,1.244m1.952-2.711a3.35,3.35,0,0,0-.7-.981,3.476,3.476,0,0,0-1.023-.715l.509-.639q.134-.153.271-.3a2.126,2.126,0,0,1,1.9,1.849q-.161.147-.325.291ZM76.4,2.468a.017.017,0,0,1,.013,0l.007.007a0,0,0,0,1,0,0,20.668,20.668,0,0,1-3.5,5.354,3.908,3.908,0,0,0-1.879-1.853A20.787,20.787,0,0,1,76.4,2.468" transform="translate(-60.563 -0.669)" />
            <path d="M16.832,7.96a.881.881,0,0,0-.881.881v4.812a2.3,2.3,0,0,1-2.3,2.3H4.06a2.3,2.3,0,0,1-2.3-2.3V4.06a2.3,2.3,0,0,1,2.3-2.3H8.829A.881.881,0,1,0,8.829,0H4.06A4.064,4.064,0,0,0,0,4.06v9.593a4.064,4.064,0,0,0,4.06,4.06h9.593a4.064,4.064,0,0,0,4.06-4.06V8.841a.881.881,0,0,0-.881-.881" />
        </svg>

    );
};

export default EditIcon;