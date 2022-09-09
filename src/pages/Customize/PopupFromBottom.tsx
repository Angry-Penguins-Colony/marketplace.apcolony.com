import * as React from 'react';
import { IItem } from '@apcolony/marketplace-api';
import Button from 'components/Button/Button';
import RoundedList from 'components/RoundedList/RoundedList';
import { ipfsGateway } from 'config';
import defaultPenguinImg from './../../assets/img/penguin_default.png';
import style from './popup-from-bottom.module.scss';

const PopupFromBottom = (
    {
        title,
        type,
        items,
        isOpen = false,
        selectedItemsIdentifier: selectedItems,
        onItemClick = function () {
            // do nothing
        },
        cancel = function () {
            // do nothing
        },
        select = function () {
            // do nothing
        },
        changeType = function () {
            // do nothing
        }
    }: {
        title: string;
        type: string;
        items: IItem[],
        selectedItemsIdentifier: Record<string, string | undefined>,
        isOpen?: boolean;
        onItemClick?: (item: IItem) => void;
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
                            number: items.length,
                            current: type === 'all',
                            onClick: function () {
                                changeType('all');
                            }
                        },
                        getRoundedSlotChild('Background', 'background'),
                        getRoundedSlotChild('Beak', 'beak'),
                        getRoundedSlotChild('Eyes', 'eyes'),
                        getRoundedSlotChild('Clothes', 'clothes'),
                        getRoundedSlotChild('Hat', 'hat'),
                        getRoundedSlotChild('Skin', 'skin'),
                        getRoundedSlotChild('Weapon', 'weapon'),
                    ]}

                    className={style['rounded-list']}
                />
                <div className={style.items}>
                    <div className={style.content}>
                        {items.map((item) => {

                            if (!item.identifier) throw new Error(`Item has no identifier. ${item}`);

                            const isSelected = selectedItems[item.slot] == item.identifier;

                            return (
                                <SelectableItem
                                    count={item.amount}
                                    name={item.name}
                                    renderImageSrc={ipfsGateway + item.renderCID}
                                    key={item.identifier}
                                    isSelected={isSelected}
                                    isVisible={type == 'all' || item.slot == type}
                                    onClick={() => {
                                        onItemClick(item);
                                    }}
                                />
                            )
                        })}
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

    function getRoundedSlotChild(name: string, slotType: string) {
        return {
            name: name,
            number: getAmountOfItems(items, slotType),
            current: slotType === slotType,
            onClick: function () {
                changeType(slotType);
            }
        };
    }
};

export default PopupFromBottom;

const SelectableItem = (
    {
        count,
        name,
        renderImageSrc,
        isSelected = false,
        isVisible,
        onClick = function () {
            // do nothing
        }

    }: {
        count: number;
        name: string;
        renderImageSrc: string;
        isSelected?: boolean;
        isVisible: boolean;
        onClick?: () => void;
    }
) => {
    return (
        <div className={style.item + (isSelected ? ' ' + style['is-selected'] : '') + (isVisible ? '' : ' ' + style['is-hidden'])} onClick={onClick}>
            <img className={style.model} src={defaultPenguinImg} alt="Model" />
            <img src={renderImageSrc} className={style.thumbnail} alt={name} />

            <div className={style.count}>{count}</div>
            <div className={style['back-name']}></div>
            <div className={style.name}>{name}</div>
        </div>
    );
};


function getAmountOfItems(items: IItem[], slot: string): number {
    return items.reduce((acc, item) => (item.slot === slot ? acc + 1 : acc), 0);
}
