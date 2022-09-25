import React from 'react';
import Popup from 'components/Foreground/Popup/Generic/Popup';
import style from './unlock.module.scss';

export const SuccessLogin = () => {

    return (
        <Popup topIcon={
            <svg xmlns="http://www.w3.org/2000/svg" width="83" height="83" viewBox="0 0 83 83">
                <g id="Groupe_1179" data-name="Groupe 1179" transform="translate(-172.5 -350.5)">
                    <path id="Tracé_250" data-name="Tracé 250" d="M0,39A39,39,0,1,1,39,78,39,39,0,0,1,0,39" transform="translate(175 353.001)" fill="#fff" stroke="#2d9565" strokeWidth="5" />
                    <g id="Checkmark_ico" transform="translate(196.395 378.333)">
                        <path id="Tracé_330" data-name="Tracé 330" d="M39.162.779a2.794,2.794,0,0,0-3.871,0L14.576,20.912l-9.9-9.625a2.794,2.794,0,0,0-3.871,0,2.608,2.608,0,0,0,0,3.762L12.641,26.555a2.794,2.794,0,0,0,3.871,0L39.162,4.541a2.608,2.608,0,0,0,0-3.762" transform="translate(0 0)" fill="#2d9565" />
                    </g>
                </g>
            </svg>
        } className={style['success-popup']} isVisible={true}>
            <h2>Successfully</h2>
            <p>Logged in</p>
        </Popup>
    );
};

export default SuccessLogin;
