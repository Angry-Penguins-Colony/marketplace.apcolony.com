import React from 'react';
import style from './style.module.scss';

interface IProps {
    children?: React.ReactNode;
}

const LoadingOverlay = ({ children }: IProps) => {
    return <div className={style['locked-content']}>
        <div>
            <div className="spinner-border" role="status">
                <span className="sr-only">Loading...</span>
            </div>
            <br />

            <div>
                {children}

            </div>
        </div>
    </div>
};

export default LoadingOverlay;