import * as React from 'react';
import Button from 'components/Button/Button';
import RoundedList from 'components/RoundedList/RoundedList';
import defaultPenguinImg from './../../assets/img/penguin_default.png';
import { Item as ItemObject } from './Item';
import style from './popup-from-bottom.module.scss';

const PopupFromBottom = (
    {
        title,
        type,
        items,
        isOpen = false,
        toggleSelected = function (index: number, type: string) {
            // do nothing
        },
        cancel = function () {
            // do nothing
        },
        select = function (type: string) {
            // do nothing
        },
        changeType = function (type: string) {
            // do nothing
        }
    }: {
        title: string;
        type: string;
        items: ItemObject[];
        isOpen?: boolean;
        toggleSelected?: (index: number, type: string) => void;
        cancel?: () => void;
        select?: (type: string) => void;
        changeType?: (type: string) => void;
    }
) => {
    return (
        <div id={style['popup-from-bottom']} className={(isOpen ? style['is-open'] : style['is-close'])}>
            <div className={style.content}>
                <h3>{title}</h3>
                <h3 className={style.desktop}>All My Items</h3>
                {/* TODO: bind this values */}
                <RoundedList
                    items={[
                        {
                            name: 'All Items',
                            number: 50,
                            current: type === 'all',
                            onClick: function () {
                                changeType('all');
                            }
                        },
                        {
                            name: 'Hats',
                            number: 3,
                            current: type === 'hat',
                            onClick: function () {
                                changeType('hat');
                            }
                        },
                        {
                            name: 'Eyes',
                            number: 6,
                            current: type === 'eye',
                            onClick: function () {
                                changeType('eye');
                            }
                        },
                        {
                            name: 'Clothes',
                            number: 8,
                            current: type === 'clothes',
                            onClick: function () {
                                changeType('clothes');
                            }
                        },
                        {
                            name: 'Beak',
                            number: 8,
                            current: type === 'beak',
                            onClick: function () {
                                changeType('beak');
                            }
                        },
                        {
                            name: 'Skin',
                            number: 2,
                            current: type === 'skin',
                            onClick: function () {
                                changeType('skin');
                            }
                        },
                        {
                            name: 'Weapon',
                            number: 2,
                            current: type === 'weapon',
                            onClick: function () {
                                changeType('weapon');
                            }
                        },
                        {
                            name: 'Background',
                            number: 2,
                            current: type === 'background',
                            onClick: function () {
                                changeType('background');
                            }
                        }
                    ]}

                    className={style['rounded-list']}
                />
                <div className={style.items}>
                    <div className={style.content}>
                        {items.map((item, index) => (
                            <Item
                                count={item.count}
                                name={item.name}
                                thumbnail={item.thumbnail}
                                key={item.id}
                                isSelected={item.isSelected}
                                isVisible={type == 'all' || item.type == type}
                                toggleSelected={() => {
                                    toggleSelected(index, item.type);
                                }}
                            />
                        ))}
                    </div>
                </div>
                <div className={style.controls}>
                    {/* TODO: bind buttons */}
                    <Button type="cancel" onClick={cancel}>Cancel</Button>
                    <Button type="primary" onClick={() => { select(type); }}>Select</Button>
                </div>
            </div>
        </div>
    );
};

export default PopupFromBottom;

const Item = (
    {
        count,
        name,
        thumbnail,
        isSelected = false,
        isVisible,
        toggleSelected = function () {
            // do nothing
        }

    }: {
        count: number;
        name: string;
        thumbnail: string;
        isSelected?: boolean;
        isVisible: boolean;
        toggleSelected?: () => void;
    }
) => {
    return (
        <div className={style.item + (isSelected ? ' ' + style['is-selected'] : '') + (isVisible ? '' : ' ' + style['is-hidden'])} onClick={toggleSelected}>
            <img className={style.model} src={defaultPenguinImg} alt="Model" />
            <img className={style.thumbnail} src={thumbnail} alt={name} />
            <div className={style.count}>{count}</div>
            <div className={style['back-name']}></div>
            <div className={style.name}>{name}</div>
        </div>
    );
};