import React, { SyntheticEvent } from 'react';
import { ipfsGateway } from 'config';

const IPFSImage = (props: {
    cid: string,
    className?: string,
    alt?: string,
    onLoad?: (event: SyntheticEvent) => void,
}
) => {

    return <img
        onLoad={props.onLoad}
        src={ipfsGateway + props.cid}
        className={['w-100 h-100', props.className].join(' ')}
        alt={props.alt}
    />;
};

export default IPFSImage;