import React from 'react';
import { useNavigate } from 'react-router-dom';
import APCLogoWhite from 'assets/img/apc-logo/white.png';
import LoginLogoutButton from 'components/Buttons/LoginLogoutButton';
import CrossIcon from 'components/Icons/CrossIcon';
import style from './mobile-menu.module.scss';

const MobileMenu = (
    {
        navItems,
        isOpen,
        onClose,
    }: {
        navItems: any[],
        isOpen: boolean,
        onClose: () => void,
    }
) => {

    const navigate = useNavigate();

    return (
        <div className={style['mobile-menu'] + ' ' + (isOpen ? style['open'] : style['close'])}>
            <header>
                <img src={APCLogoWhite} alt="logo Angry Penguins" />
                <div className={style['close']} onClick={onClose}>
                    <CrossIcon className={style['icon']} />
                </div>
            </header>
            <div className={style['content']}>
                <div className={style['title']}>Marketplace</div>
                {
                    navItems.map((item, index) => (
                        <p className={style['menu-item']} key={index} onClick={() => {
                            if (item.action) {
                                item.action();
                            }
                            else {
                                navigate(item.route);
                                onClose();
                            }
                        }}>
                            {item.name}
                        </p>
                    ))
                }
            </div>
            <footer>
                <LoginLogoutButton type="normal" className={style.button} />
                <hr />
                <div className={style['privacy-policy']}>
                    <a href='TODO: add terms'>Terms</a>
                    <a href='TODO: add privacy'>Privacy Policy</a>
                </div>
                <div className={style['webdesign-by']}>
                    <span>WebDesign by</span>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 153.842 8.754">
                        <path d="M157.787,8.332a3.774,3.774,0,0,1-3.9-3.827,3.889,3.889,0,0,1,7.776,0,3.749,3.749,0,0,1-3.879,3.827M41.295,4.505A3.708,3.708,0,0,1,45.088.677a3.515,3.515,0,0,1,3.535,2.747H47.406a2.35,2.35,0,0,0-2.3-1.58,2.522,2.522,0,0,0-2.557,2.644,2.512,2.512,0,0,0,2.557,2.643A2.35,2.35,0,0,0,47.44,5.449h1.236A3.529,3.529,0,0,1,45.122,8.3a3.669,3.669,0,0,1-3.827-3.793m71.367,1.373H113.9c0,.823.687,1.287,1.544,1.287.789,0,1.459-.412,1.459-1.081,0-.738-.789-.909-1.683-1.133-1.132-.274-2.419-.584-2.419-2.111,0-1.322,1.013-2.111,2.575-2.111a2.229,2.229,0,0,1,2.54,2.265h-1.2c0-.738-.6-1.132-1.373-1.132-.738,0-1.338.343-1.338.943,0,.687.755.858,1.63,1.081,1.149.292,2.489.618,2.489,2.2,0,1.476-1.184,2.265-2.678,2.265-1.647-.051-2.781-.978-2.781-2.471m-7.843,1.167V8.2h-4.395V.815H104.7V1.947h-3.073V3.87h2.814V4.986h-2.8v2.06ZM97.2.815,94.331,8.2H93.2L90.264.815H91.6l2.163,5.647L95.875.815ZM85.87.815h1.2V8.2h-1.2ZM82.591,1.947H80.428V8.2h-1.2V1.947H77.064V.815h5.527ZM73.34,6.582H70.061L69.427,8.2H68.139L71.108.832h1.133L75.3,8.2h-1.3Zm-7.963.464V8.2H60.982V.815h4.273V1.947H62.184V3.87h2.8V4.986h-2.8v2.06ZM54.631,5.466h-1.39V8.2h-1.2V.815h2.867a2.329,2.329,0,0,1,2.471,2.334,2.252,2.252,0,0,1-1.493,2.145l1.7,2.9H56.21Zm71.694-3.519h-2.162V8.2h-1.2V1.947H120.8V.815h5.526Zm3.193,3.484V.815h1.219V5.346a1.743,1.743,0,1,0,3.484,0V.815h1.218V5.432a2.961,2.961,0,0,1-5.922,0m16.152-.926a3.6,3.6,0,0,1-3.743,3.69h-2.591V.815h2.591a3.594,3.594,0,0,1,3.743,3.69m3.518-3.69h1.2V8.2h-1.2Zm11.261,3.69a2.661,2.661,0,1,0-5.321,0,2.661,2.661,0,0,0,5.321,0m-16.015,0a2.447,2.447,0,0,0-2.54-2.558h-1.355V7.062h1.355a2.456,2.456,0,0,0,2.54-2.557M53.224,4.333h1.6a1.191,1.191,0,1,0,0-2.368h-1.6ZM70.474,5.5h2.454L71.693,2.394Z" transform="translate(-7.825 -0.128)" />
                        <path d="M30.328,8.754H22.553l3.9-4.377L22.553,0h7.775L26.449,4.377Z" transform="translate(-4.273 0)" />
                        <path d="M19.338,8.754H11.562L15.493,0Z" transform="translate(-2.191 0)" />
                        <path d="M4.343,4.381V.021A4.36,4.36,0,1,0,8.72,4.381Z" transform="translate(0 -0.004)" />
                    </svg>
                </div>
            </footer>
        </div >
    );
}

export default MobileMenu;