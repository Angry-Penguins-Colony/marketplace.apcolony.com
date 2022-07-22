import * as React from 'react';
import Button from 'components/Button/Button';
import defaultPenguinImg from './../../assets/img/penguin_default.png';
import { Item as ItemObject } from './Item';
import style from './popup-from-bottom.module.scss';

const PopupFromBottom = (
    {
        title,
        type,
        items,
        isOpen = false,
        toggleSelected = function (index: number) {
            // do nothing
        },
        cancel = function () {
            // do nothing
        },
        select = function (type: string) {
            // do nothing
        }
    }: {
        title: string;
        type: string;
        items: ItemObject[];
        isOpen?: boolean;
        toggleSelected?: (index: number) => void;
        cancel?: () => void;
        select?: (type: string) => void;
    }
) => {
    return (
        <div id={style['popup-from-bottom']} className={(isOpen ? style['is-open'] : style['is-close'])}>
            <div className={style.content}>
                <h3>{title}</h3>
                <div className={style.items}>
                    <div className={style.content}>
                        {items.map((item, index) => (
                            <Item
                                count={item.count}
                                name={item.name}
                                thumbnail={item.thumbnail}
                                key={item.id}
                                isSelected={item.isSelected}
                                toggleSelected={() => {
                                    toggleSelected(index);
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
        toggleSelected = function () {
            // do nothing
        }

    }: {
        count: number;
        name: string;
        thumbnail: string;
        isSelected?: boolean;
        toggleSelected?: () => void;
    }
) => {
    return (
        <div className={style.item + (isSelected ? ' ' + style['is-selected'] : '')} onClick={toggleSelected}>
            <img className={style.model} src={defaultPenguinImg} alt="Model" />
            <img className={style.thumbnail} src={thumbnail} alt={name} />
            <div className={style.count}>{count}</div>
            <div className={style['back-name']}></div>
            <div className={style.name}>{name}</div>
        </div>
    );
};