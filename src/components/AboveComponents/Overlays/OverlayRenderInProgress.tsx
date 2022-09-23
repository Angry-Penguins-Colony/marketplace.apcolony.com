import React from 'react';
import style from './OverlayRenderInProgress.module.scss';

const OverlayRenderInProgress = () => {
    return <div className={style['locked-content']}>
        <div>
            <div className="spinner-border" role="status">
                <span className="sr-only">Loading...</span>
            </div>
            <br />

            <div>
                <h2>Editing disabled</h2>
                <br />
                <p>Syncing new penguin image on the blockchain...</p>
                <p>Please, wait a minute</p>
            </div>
        </div>
    </div>
};

export default OverlayRenderInProgress;