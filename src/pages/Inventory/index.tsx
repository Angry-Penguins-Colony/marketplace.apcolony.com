import * as React from 'react';
import BackIcon from 'components/Icons/BackIcon';
import CrossIcon from 'components/Icons/CrossIcon';
import KebabIcon from 'components/Icons/KebabIcon';
import SettingIcon from 'components/Icons/SettingIcon';
import ShareIcon from 'components/Icons/ShareIcon';
import SortIcon from 'components/Icons/SortIcon';
import style from './inventory.module.scss';

const Inventory = () => {

    const walletAddress = 'erd10000000000000000000000000000000000000000000000000000000000';

    return (
        <>
            <div id={style['mobile-header']}>
                <BackIcon className={style.icon} />
                <h1>My Inventory</h1>
                <KebabIcon className={style.icon} />
            </div>
            <div id={style['body-content']}>
                <header>
                    <h2>Pseudonyme</h2>
                    <p className={style['wallet-address']}>
                        <span>{walletAddress}</span>
                        <div className={style.share} onClick={
                            () => {
                                navigator.share({
                                    title: document.title,
                                    text: walletAddress,
                                    url: window.location.href
                                });
                            }
                        }>
                            <ShareIcon className={style.icon} />
                        </div>
                    </p>
                </header>

                <section id={style['navigation-type']}>
                    <span className={style.item + ' ' + style.active}>Penguins</span>
                    <span className={style.item}>Eggs</span>
                    <span className={style.item}>items</span>
                </section>

                <section id={style.inventory}>
                    <header>
                        <div className={style.title}>
                            <h3>My Penguins</h3>
                            {/* TODO: Bind this value */}
                            <span className={style['number-items']}>18</span>
                            <p className={style.info}>(Select a penguin to customize it)</p>
                        </div>
                        <div className={style.nav}>
                            <div className={style.sort}>
                                <SortIcon className={style['icon-sort']} />
                            </div>
                            <div className={style['select-filter'] + ' ' + style.filter}>
                                <SettingIcon />
                                <span className={style.name}>Background</span>
                                <span className={style.number}>5</span>
                            </div>
                            <div className={style['attribute-info']}>
                                <div className={style.filter}>
                                    <span className={style.name}>Hat</span>
                                    <span className={style.number}>3</span>
                                </div>
                                <div className={style.filter}>
                                    <span className={style.name}>Eyes</span>
                                    <span className={style.number}>8</span>
                                </div>
                                <div className={style.filter}>
                                    <span className={style.name}>Beack</span>
                                    <span className={style.number}>8</span>
                                </div>
                                <div className={style.filter}>
                                    <span className={style.name}>Beack</span>
                                    <span className={style.number}>8</span>
                                </div>
                            </div>
                            <div className={style['reset-filter']}>
                                <CrossIcon className={style.icon} />
                            </div>
                        </div>
                    </header>
                    <div className={style['all-items']}>
                        <div className={style.item}>
                            <img src="/Fargerik_bg-overlay.png" />
                            <div className={style.name}>Penguin #1</div>
                        </div>
                        <div className={style.item}>
                            <img src="/Fargerik_bg-overlay.png" />
                            <div className={style.name}>Penguin #2</div>
                        </div>
                        <div className={style.item}>
                            <img src="/Fargerik_bg-overlay.png" />
                            <div className={style.name}>Penguin #3</div>
                        </div>
                        <div className={style.item}>
                            <img src="/Fargerik_bg-overlay.png" />
                            <div className={style.name}>Penguin #4</div>
                        </div>
                        <div className={style.item}>
                            <img src="/Fargerik_bg-overlay.png" />
                            <div className={style.name}>Penguin #5</div>
                        </div>
                        <div className={style.item}>
                            <img src="/Fargerik_bg-overlay.png" />
                            <div className={style.name}>Penguin #6</div>
                        </div>
                        <div className={style.item}>
                            <img src="/Fargerik_bg-overlay.png" />
                            <div className={style.name}>Penguin #7</div>
                        </div>
                        <div className={style.item}>
                            <img src="/Fargerik_bg-overlay.png" />
                            <div className={style.name}>Penguin #8</div>
                        </div>
                        <div className={style.item}>
                            <img src="/Fargerik_bg-overlay.png" />
                            <div className={style.name}>Penguin #9</div>
                        </div>
                        <div className={style.item}>
                            <img src="/Fargerik_bg-overlay.png" />
                            <div className={style.name}>Penguin #10</div>
                        </div>
                        <div className={style.item}>
                            <img src="/Fargerik_bg-overlay.png" />
                            <div className={style.name}>Penguin #11</div>
                        </div>
                        <div className={style.item}>
                            <img src="/Fargerik_bg-overlay.png" />
                            <div className={style.name}>Penguin #12</div>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
};

export default Inventory;
