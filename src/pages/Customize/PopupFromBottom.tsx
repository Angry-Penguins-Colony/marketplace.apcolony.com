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
        selectedItems,
        toggleSelected = function () {
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
        selectedItems: Record<string, IItem | undefined>,
        isOpen?: boolean;
        toggleSelected?: (item: IItem) => void;
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

                            // if (item.name == 'Yellow') {
                            //     console.log('item', item.identifier);
                            //     console.log('selected', selectedItems[item.slot]?.identifier);
                            //     console.log('\n');
                            // }

                            const isSelected = selectedItems[item.slot]?.identifier == item.identifier;

                            return (
                                <SelectableItem
                                    count={item.amount}
                                    name={item.name}
                                    renderImageSrc={ipfsGateway + item.renderCID}
                                    key={item.identifier}
                                    isSelected={isSelected}
                                    isVisible={type == 'all' || item.slot == type}
                                    toggleSelected={() => {
                                        toggleSelected(item);
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
        toggleSelected = function () {
            // do nothing
        }

    }: {
        count: number;
        name: string;
        renderImageSrc: string;
        isSelected?: boolean;
        isVisible: boolean;
        toggleSelected?: () => void;
    }
) => {
    return (
        <div className={style.item + (isSelected ? ' ' + style['is-selected'] : '') + (isVisible ? '' : ' ' + style['is-hidden'])} onClick={toggleSelected}>
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
