import * as React from 'react';
import { IItem } from '@apcolony/marketplace-api';
import Button from 'components/Abstract/Button/Button';
import RoundedList, { IRoundedItem } from 'components/Abstract/RoundedList/RoundedList';
import defaultPenguinImg from './../../../assets/img/penguin_default.png';
import style from './PopupFromBottom.module.scss';

const PopupFromBottom = (
    {
        title,
        filterSlot,
        items,
        isOpen = false,
        ownedItemsAmount,
        selectedItemsIdentifier: selectedItems,
        disableSelection = false,
        onItemClick = function () {
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
        filterSlot?: string;
        items: IItem[],
        ownedItemsAmount: Record<string, number>,
        selectedItemsIdentifier: Record<string, string | undefined>,
        isOpen?: boolean;
        onItemClick?: (item: IItem) => void;
        select?: () => void;
        changeType?: (type: string | undefined) => void;
        disableSelection?: boolean;
    }
) => {

    if (filterSlot) {
        items = items
            .filter(item => item.slot == filterSlot);
    }

    return (
        <div id={style['popup-from-bottom']} className={(isOpen ? style['is-open'] : style['is-close'])}>

            <div className={style.content}>

                <h3>{title}</h3>
                <h3 className={style.desktop}>All My Items</h3>

                <RoundedList
                    items={[
                        {
                            name: 'All Items',
                            number: items.length,
                            selected: !filterSlot,
                            onClick: function () {
                                changeType(undefined);
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
                                    count={ownedItemsAmount[item.id] ?? 0}
                                    name={item.name}
                                    renderImageSrc={item.renderUrls.high}
                                    key={item.identifier}
                                    isSelected={isSelected}
                                    isDisabled={disableSelection}
                                    isVisible={!filterSlot || item.slot == filterSlot}
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
                    {/* <Button type="cancel" onClick={cancel}>Cancel</Button> */}
                    <Button type="primary" onClick={() => { select(); }}>Select</Button>
                </div>
            </div>
        </div>
    );

    function getRoundedSlotChild(name: string, slotType: string): IRoundedItem {
        return {
            name: name,
            number: getAmountOfItems(items, slotType),
            selected: slotType === filterSlot,
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
        isDisabled = false,
        onClick = function () {
            // do nothing
        }

    }: {
        count: number;
        name: string;
        renderImageSrc: string;
        isSelected?: boolean;
        isVisible: boolean;
        isDisabled?: boolean;
        onClick?: () => void;
    }
) => {
    const className = [
        style.item,
        isSelected ? style['is-selected'] : '',
        isVisible ? '' : style['is-hidden'],
        isDisabled ? style['is-disabled'] : '',
    ].join(' ')

    return (
        <div className={className} onClick={onClick}>
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
