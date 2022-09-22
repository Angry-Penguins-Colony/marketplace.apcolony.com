import React from 'react';
import { IInventoryItem } from 'pages/Inventory/types/IInventoryItem';

function useInventoryFilter(
    items: IInventoryItem[] | undefined,
    setItems: React.Dispatch<React.SetStateAction<IInventoryItem[] | undefined>>
) {

    // TODO: number of items per attribute
    const [filterData, setFilterData] = React.useState(placeholder);

    return {
        sortBy,
        changeFilters,
        filterData
    }

    function sortBy(type: string) {

        if (!items) return;

        switch (type) {
            case 'recently-added':
                setItems([...items.sort((a, b) => {
                    return new Date(b.purchaseDate || '1970-01-01').getTime() - new Date(a.purchaseDate || '1970-01-01').getTime();
                }
                )]);
                break;
            case 'rarity-high-to-low':
                setItems([...items.sort((a, b) => {
                    return (b.score || 0) - (a.score || 0);
                }
                )]);
                break;
            case 'rarity-low-to-high':
                setItems([...items.sort((a, b) => {
                    return (a.score || 0) - (b.score || 0);
                }
                )]);
                break;
            default:
                setItems([...items.sort((a, b) => {
                    return new Date(b.purchaseDate || '1970-01-01').getTime() - new Date(a.purchaseDate || '1970-01-01').getTime();
                }
                )]);
                break;
        }
        console.table(items);
    }



    function changeFilters(newFilterData: any) {
        setFilterData({
            ...newFilterData,
            selected: newFilterData.items.map((item:
                {
                    title: string;
                    value: string;
                    icon: string;
                    attributes: {
                        name: string;
                        number: number;
                        value: string;
                        isSelected: boolean;
                        isTmpSelected: boolean;
                    }[];
                }) => {
                const number = item.attributes.filter((attr: { isSelected: boolean; }) => attr.isSelected).length;

                if (number > 0) {
                    return {
                        name: item.title,
                        value: item.value,
                        number: number
                    };
                } else {
                    return null;
                }
            }).filter((item: any) => item !== null)
        });
    }
}

export default useInventoryFilter;

const placeholder = {
    items: [
        {
            title: 'Background',
            value: 'background',
            icon: '/img/icon/background_icon.png',
            attributes: [
                {
                    name: 'Blue Gradient',
                    number: 150,
                    value: 'blue-gradient',
                    isSelected: false,
                    isTmpSelected: false,
                },
                {
                    name: 'Dark Blue',
                    number: 75,
                    value: 'dark-blue',
                    isSelected: false,
                    isTmpSelected: false,
                },
                {
                    name: 'Red',
                    number: 135,
                    value: 'red',
                    isSelected: false,
                    isTmpSelected: false,
                }
            ]
        },
        {
            title: 'Hat',
            value: 'hat',
            icon: '/img/icon/hat_icon.png',
            attributes: [
                {
                    name: 'Blue Bitcoin Cap',
                    number: 150,
                    value: 'blue-bitcoin-cap',
                    isSelected: false,
                    isTmpSelected: false,
                }
            ]
        },
        {
            title: 'Eyes',
            value: 'eyes',
            icon: '/img/icon/eyes_icon.png',
            attributes: [
                {
                    name: 'Blue',
                    number: 150,
                    value: 'hat-blue',
                    isSelected: false,
                    isTmpSelected: false,
                },
                {
                    name: 'Red',
                    number: 75,
                    value: 'hat-red',
                    isSelected: false,
                    isTmpSelected: false,
                },
                {
                    name: 'Yellow',
                    number: 135,
                    value: 'hat-yellow',
                    isSelected: false,
                    isTmpSelected: false,
                }
            ]
        },
        {
            title: 'Beak',
            value: 'beak',
            icon: '/img/icon/beak_icon.png',
            attributes: [
                {
                    name: 'Straw',
                    number: 150,
                    value: 'straw',
                    isSelected: false,
                    isTmpSelected: false,
                },
                {
                    name: 'Pipe',
                    number: 75,
                    value: 'pipe',
                    isSelected: false,
                    isTmpSelected: false,
                }
            ]
        },
        {
            title: 'Clothes',
            value: 'clothes',
            icon: '/img/icon/clothes_icon.png',
            attributes: [
                {
                    name: 'Coat With Brown Fur',
                    number: 150,
                    value: 'coat-with-brown-fur',
                    isSelected: false,
                    isTmpSelected: false,
                },
                {
                    name: 'Red Lifejacket',
                    number: 75,
                    value: 'red-lifejacket',
                    isSelected: false,
                    isTmpSelected: false,
                }
            ]
        },
        {
            title: 'Weapons',
            value: 'weapons',
            icon: '/img/icon/weapons_icon.png',
            attributes: [
                {
                    name: 'Snowboard',
                    number: 150,
                    value: 'snowboard',
                    isSelected: false,
                    isTmpSelected: false,
                },
                {
                    name: 'Fishing Rifle',
                    number: 75,
                    value: 'fishing-rifle',
                    isSelected: false,
                    isTmpSelected: false,
                },
                {
                    name: 'Axe',
                    number: 135,
                    value: 'axe',
                    isSelected: false,
                    isTmpSelected: false,
                }
            ]
        },
        {
            title: 'Skin',
            value: 'skin',
            icon: '/img/icon/skin_icon.png',
            attributes: [
                {
                    name: 'Claw Marks',
                    number: 150,
                    value: 'claw-marks',
                    isSelected: false,
                    isTmpSelected: false,
                },
                {
                    name: 'Black',
                    number: 75,
                    value: 'black',
                    isSelected: false,
                    isTmpSelected: false,
                },
                {
                    name: 'Light Frozen',
                    number: 135,
                    value: 'light-frozen',
                    isSelected: false,
                    isTmpSelected: false,
                }
            ]
        }
    ],
    selected: []
};