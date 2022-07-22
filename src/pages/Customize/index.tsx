import * as React from 'react';
import { useParams } from 'react-router-dom';
import Button from 'components/Button/Button';
import RefreshIcon from 'components/Icons/RefreshIcon';
import MobileHeader from 'components/Layout/MobileHeader/MobileHeader';
import tmpImgBackground from './../../assets/img/penguin_background.png';
import style from './customize.module.scss';
import GoToAnotherPenguin from './GoToAnotherPenguin';
import { Item } from './Item';
import PopupFromBottom from './PopupFromBottom';
import PenguinRender from './Render';

function getMyPenguinData(id: string | undefined) {
    if (id === undefined) {
        // TODO: found first penguin of user api call
        id = '????';
    }

    return {
        id,
        // add more data
    };
}

interface PenguinItems {
    background?: string;
    hat?: string;
    eyes?: string;
    clothes?: string;
    beak?: string;
    skin?: string;
    weapon?: string;
}

const Customize = () => {
    const { id } = useParams();
    const penguinData = getMyPenguinData(id);

    const [penguinItems, setPenguinItems] = React.useState<PenguinItems>({});

    React.useEffect(() => {
        setTimeout(() => { // simulate server call TODO: add api call
            setPenguinItems({
                background: tmpImgBackground,
            });
        }, 900);
    }, []);

    function resetItems() {
        setPenguinItems({});
    }

    function cancelAll() {
        // go to inventory with confirmation
        if (confirm('Are you sure you want to cancel all changes?')) {
            window.location.href = '/inventory';
        }
    }

    function saveCustomization() {
        // TODO: save customization
        console.log('save customization');
        // TODO: api call etc
    }

    function addItem(itemType: string, itemSrc: string | undefined) {
        // add item
        const newItems = {
            ...penguinItems,
            [itemType]: itemSrc
        };
        setPenguinItems(newItems);
    }

    /* Choose items popup */

    const [itemsPopupIsOpen, setItemsPopupIsOpen] = React.useState<boolean>(false);
    const [itemsPopupTitle, setItemsPopupTitle] = React.useState<string>('?');
    const [itemsPopupType, setItemsPopupType] = React.useState<string>('?');
    const [itemsInPopup, setItemsInPopup] = React.useState<Item[]>([]);

    // change selected item in popup
    function toggleSelectedInPopup(itemIndex: number) {
        // search item with id and change isSelected
        const newItems = [...itemsInPopup];
        const newIsSelected = !newItems[itemIndex].isSelected;
        if (newIsSelected) {
            // unselect all other items
            newItems.forEach((item) => {
                item.isSelected = false;
            });
        }

        newItems[itemIndex].isSelected = !newItems[itemIndex].isSelected;

        setItemsInPopup(newItems);
    }

    function openItemsPopup(type: string, title: string) {
        setItemsPopupType(type);
        // TODO: get data from api
        setItemsInPopup([
            {
                id: '1',
                thumbnail: 'https://apc.mypinata.cloud/ipfs/QmbTeQdUcunaqTKRAyDqk8RXYEyVLCDPHJr8m7XqFTEYyj',
                name: 'Hat 1',
                count: 15,
            },
            {
                id: '2',
                thumbnail: 'https://apc.mypinata.cloud/ipfs/QmQZXuCiqoPvxwpGvog7vSNmm6YPyMoKhjdRSN25yW1NFB',
                name: 'Hat 2',
                count: 15,
            },
            {
                id: '3',
                thumbnail: 'https://apc.mypinata.cloud/ipfs/QmR8jehRV2UNdxXFVzB2yK1oUh8gKxxjMHoMM5WBGuAiri',
                name: 'Hat 3',
                count: 15,
            },
            {
                id: '4',
                thumbnail: 'https://apc.mypinata.cloud/ipfs/QmVmAtB1cWBJvP61cF96W4JsfCBuWkjK7Kvjc6Tz14YQ5G',
                name: 'Hat 4',
                count: 15,
                isSelected: true,
            },
            {
                id: '5',
                thumbnail: 'https://apc.mypinata.cloud/ipfs/QmUJBtKH93AKrz27TtEnisPcD3sJLNU3S7bqxbwD7X1o6L',
                name: 'Hat 5',
                count: 15,
            },
            {
                id: '6',
                thumbnail: 'https://apc.mypinata.cloud/ipfs/QmS1PptqaenV5P3cMcAcQBu9rbCXGNmY2iYdf2jnu6ZoFu',
                name: 'Hat 7',
                count: 15,
            },
            {
                id: '7',
                thumbnail: 'https://apc.mypinata.cloud/ipfs/QmNaKPRfWt5oPkozP92HqaxZYZYuaVom2SgKbJcGG1E7zS',
                name: 'Hat 7',
                count: 15,
            },
            {
                id: '8',
                thumbnail: 'https://apc.mypinata.cloud/ipfs/QmY7WAa7GTJBHb8APMsYdZZ2FNWLsz8z84D1ndNntA8k3Y',
                name: 'Hat 8',
                count: 15,
            }
        ]);
        // end TODO: get data from api
        setItemsPopupTitle(title);
        setItemsPopupIsOpen(true);
    }

    return (
        <>
            <MobileHeader title="Customize" subTitle={'Penguin #' + penguinData.id} />
            <section className={style.customize}>
                <div className={style.content}>
                    <div className={style.items}>
                        <div className={style.item + ' ' + style.hat} onClick={() => { openItemsPopup('hat', 'Hats'); }}></div>
                        <div className={style.item + ' ' + style.eyes} onClick={() => { openItemsPopup('eyes', 'Eyes'); }}></div>
                        <div className={style.item + ' ' + style.clothes} onClick={() => { openItemsPopup('clothes', 'Clothes'); }}></div>
                    </div>
                    <PenguinRender items={penguinItems} />
                    <div className={style.items}>
                        <div className={style.item + ' ' + style.beak} onClick={() => { openItemsPopup('beak', 'Beak'); }}></div>
                        <div className={style.item + ' ' + style.skin} onClick={() => { openItemsPopup('skin', 'Skin'); }}></div>
                        <div className={style.item + ' ' + style.weapon} onClick={() => { openItemsPopup('weapon', 'Weapon'); }}></div>
                        <div className={style.item + ' ' + style.background} onClick={() => { openItemsPopup('background', 'Background'); }}></div>
                    </div>
                </div>
                <div className={style.reset}>
                    <Button icon={<RefreshIcon />} onClick={resetItems}>Reset Items</Button>
                </div>
                <div className={style.controls}>
                    <Button type='cancel' onClick={cancelAll}>Cancel All</Button>
                    <Button type='primary' onClick={saveCustomization}>Confirm Customization</Button>
                </div>
                <GoToAnotherPenguin className={style['another-penguins']}
                    currentPenguin={
                        {
                            id: penguinData.id,
                            thumbnail: 'https://media.elrond.com/nfts/asset/QmQTM6cz6j3qjTib5Wt71Npywddqz1fQuxYXD54e9WcaEf'
                        }
                    }
                    leftPenguin={
                        {
                            id: '1234',
                            thumbnail: 'https://media.elrond.com/nfts/asset/QmQTM6cz6j3qjTib5Wt71Npywddqz1fQuxYXD54e9WcaEf'
                        }
                    }

                    rightPenguin={
                        {
                            id: '6845',
                            thumbnail: 'https://media.elrond.com/nfts/asset/QmQTM6cz6j3qjTib5Wt71Npywddqz1fQuxYXD54e9WcaEf'
                        }
                    }

                />
            </section>
            <PopupFromBottom
                title={itemsPopupTitle}
                type={itemsPopupType}
                isOpen={itemsPopupIsOpen}
                items={itemsInPopup}
                toggleSelected={toggleSelectedInPopup}
                cancel={() => { setItemsPopupIsOpen(false); }}
                select={(type) => {
                    const selectedItem = itemsInPopup.find((item) => item.isSelected);
                    if (selectedItem) {
                        addItem(type, selectedItem.thumbnail);
                    } else {
                        addItem(type, undefined);
                    }
                    setItemsPopupIsOpen(false);
                }}
            />
        </>
    );
};

export default Customize;