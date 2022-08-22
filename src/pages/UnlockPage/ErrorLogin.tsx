import React from 'react';
import Popup from 'components/Popup/Popup';
import style from './unlock.module.scss';

export const ErrorLogin = () => {

    return (
        <Popup topIcon={
            <svg xmlns="http://www.w3.org/2000/svg" width="83" height="83" viewBox="0 0 83 83">
                <defs>
                    <clipPath id="clip-path">
                        <rect id="Rectangle_697" data-name="Rectangle 697" width="32.8" height="32.8" fill="#e26e4f" />
                    </clipPath>
                </defs>
                <g id="Groupe_1179" data-name="Groupe 1179" transform="translate(-173 -351)">
                    <path id="Tracé_250" data-name="Tracé 250" d="M0,39A39,39,0,1,1,39,78,39,39,0,0,1,0,39" transform="translate(175.5 353.501)" fill="#fff" stroke="#e26e4f" strokeWidth="5" />
                    <g id="Groupe_1211" data-name="Groupe 1211" transform="translate(198 376)">
                        <g id="Groupe_1211-2" data-name="Groupe 1211" clipPath="url(#clip-path)">
                            <path id="Tracé_371" data-name="Tracé 371" d="M21.214,16.4,31.8,5.81A3.4,3.4,0,0,0,26.99,1L16.4,11.586,5.811,1A3.4,3.4,0,0,0,1,5.81L11.587,16.4,1,26.989A3.4,3.4,0,0,0,5.811,31.8L16.4,21.213,26.99,31.8A3.4,3.4,0,1,0,31.8,26.989Z" transform="translate(0 0)" fill="#e26e4f" />
                        </g>
                    </g>
                </g>
            </svg>
        } className={style['error-popup']} isVisible={true}>
            <h2>Something went wrong</h2>
            <p>Try again</p>
        </Popup>
    );
};

export default ErrorLogin;
