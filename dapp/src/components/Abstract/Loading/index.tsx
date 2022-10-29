import React from 'react';
import style from './style.module.scss';

interface IProps {
    children?: React.ReactNode;
    size?: 'normal' | 'large';
}

const Loading = ({
    children,
    size = 'normal'
}: IProps) => {

    return <div className={style.loading}>
        <div>
            <div className="spinner-border mb-2" style={getSize()} role="status">
                <span className="sr-only">Loading...</span>
            </div>
            <p>Loading...</p>
            <br />

            <div>
                {children}

            </div>
        </div>
    </div>

    function getSize() {
        switch (size) {
            case 'normal':
                return {};

            case 'large':
                return {
                    width: '3rem',
                    height: '3rem'
                };

            default:
                return {};
        }
    }
};

export default Loading;