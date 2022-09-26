import * as React from 'react';
import Button from 'components/Abstract/Button/Button';
import { routeNames } from 'routes';
import style from './SuccessPopup.module.scss';

const SuccessPopup = (
    {
        isVisible = false
    }: {
        isVisible?: boolean,
    }
) => {
    return (
        <div className={style.popup + ' ' + (isVisible ? style.visible : '')}>
            <div className={style.content}>
                <div className={style['top-icon']}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 83 83">
                        <path d="M0,39a39,39,0,1,1,60.67,32.43A38.6,38.6,0,0,1,39,78,39,39,0,0,1,0,39" transform="translate(2.5 2.501)" fill="#fff" stroke="#2d9565" strokeWidth="5" />
                        <g transform="translate(23.895 27.833)">
                            <path d="M39.162.779a2.794,2.794,0,0,0-3.871,0L14.576,20.912l-9.9-9.625a2.794,2.794,0,0,0-3.871,0,2.608,2.608,0,0,0,0,3.762L12.641,26.555a2.794,2.794,0,0,0,3.871,0L39.162,4.541a2.608,2.608,0,0,0,0-3.762" fill="#2d9565" />
                        </g>
                    </svg>
                </div>
                <h2>
                    <span className={style.green}>Successfully</span>
                    <br />
                    <span>Brought</span>
                </h2>
                <Button type='primary'
                    onClick={() => {
                        // go to marketplace
                        window.location.href = routeNames.home;
                    }}>Continue shopping</Button>
                <Button type='primary'
                    onClick={() => {
                        // go to item in inventory
                        // TODO: add link to direct item
                        window.location.href = routeNames.inventory;
                    }}>View on the inventory</Button>
            </div>
        </div >
    );
};

export default SuccessPopup;