import { Slotname, Nonce, IPenguin, IItem, IEgg } from '@apcolony/marketplace-api/out';

const penguinIdentifier = 'APC-928458';

export const placeholdersItems = {
    background: {
        'Blue Gradient': {
            identifier: 'BG-a1a1a1',
            nonce: new Nonce(1),
            slot: new Slotname('background'),
            name: 'Blue Gradient',
            thumbnailCID: '',
        } as IItem,
        'Dark Blue': {
            identifier: 'BG-a1a1a1',
            nonce: new Nonce(2),
            slot: new Slotname('background'),
            name: 'Dark Blue',
            thumbnailCID: '',
        } as IItem,
        'Red': {
            identifier: 'BG-a1a1a1',
            nonce: new Nonce(3),
            slot: new Slotname('background'),
            name: 'Red',
            thumbnailCID: '',
        } as IItem
    },
    beak: {
        'Straw': {
            identifier: 'BEAK-a1a1a1',
            nonce: new Nonce(1),
            slot: new Slotname('beak'),
            name: 'Straw',
            thumbnailCID: '',
        } as IItem,
        'Pipe': {
            identifier: 'BEAK-a1a1a1',
            nonce: new Nonce(2),
            slot: new Slotname('beak'),
            name: 'Pipe',
            thumbnailCID: '',
        } as IItem
    },
    clothes: {
        'Coat With Brown Fur': {
            identifier: 'CLOTHES-a1a1a1',
            nonce: new Nonce(1),
            slot: new Slotname('clothes'),
            name: 'Coat With Brown Fur',
            thumbnailCID: '',
        } as IItem,
        'Red Lifejacket': {
            identifier: 'CLOTHES-a1a1a1',
            nonce: new Nonce(2),
            slot: new Slotname('clothes'),
            name: 'Red Lifejacket',
            thumbnailCID: '',
        } as IItem,
    },
    eyes: {
        'Black': {
            identifier: 'EYES-a1a1a1',
            nonce: new Nonce(1),
            slot: new Slotname('eyes'),
            name: 'Black',
            thumbnailCID: '',
        } as IItem,
        'Red': {
            identifier: 'EYES-a1a1a1',
            nonce: new Nonce(2),
            slot: new Slotname('eyes'),
            name: 'Red',
            thumbnailCID: '',
        } as IItem
    },
    hat: {
        'Blue Bitcoin Cap': {
            identifier: 'HAT-a1a1a1',
            nonce: new Nonce(1),
            slot: new Slotname('hat'),
            name: 'Blue Bitcoin Cap',
            thumbnailCID: '',
        } as IItem,
    },
    skin: {
        'Claw Marks': {
            identifier: 'SKIN-a1a1a1',
            nonce: new Nonce(1),
            slot: new Slotname('skin'),
            name: 'Claw Marks',
            thumbnailCID: '',
        } as IItem,
        'Black': {
            identifier: 'SKIN-a1a1a1',
            nonce: new Nonce(2),
            slot: new Slotname('skin'),
            name: 'Black',
            thumbnailCID: '',
        } as IItem,
        'Light Frozen': {
            identifier: 'SKIN-a1a1a1',
            nonce: new Nonce(3),
            slot: new Slotname('skin'),
            name: 'Light Frozen',
            thumbnailCID: '',
        } as IItem
    },
    weapon: {
        'Snowboard': {
            identifier: 'WEAPON-a1a1a1',
            nonce: new Nonce(1),
            slot: new Slotname('weapon'),
            name: 'Snowboard',
            thumbnailCID: '',
        } as IItem,
        'Fishing Rifle': {
            identifier: 'WEAPON-a1a1a1',
            nonce: new Nonce(2),
            slot: new Slotname('weapon'),
            name: 'Fishing Rifle',
            thumbnailCID: '',
        } as IItem,
        'Axe': {
            identifier: 'WEAPON-a1a1a1',
            nonce: new Nonce(3),
            slot: new Slotname('weapon'),
            name: 'Axe',
            thumbnailCID: '',
        } as IItem
    }
}

export const placeholdersPenguins = {
    '4987': {
        identifier: penguinIdentifier,
        name: 'Penguin #4987',
        nonce: new Nonce(4987),
        score: 5464,
        purchaseDate: new Date('2019-01-01'),
        thumbnailCID: 'QmW8g9GXXZR1JhDW7XNMybyRrWqWiUHa1N26DEYSoFwxMc',
        equippedItems: {
            'background': placeholdersItems.background['Blue Gradient'],
            'beak': placeholdersItems.beak['Straw'],
            'clothes': placeholdersItems.clothes['Coat With Brown Fur'],
            'hat': placeholdersItems.hat['Blue Bitcoin Cap'],
            'skin': placeholdersItems.skin['Claw Marks'],
            'weapon': placeholdersItems.weapon['Snowboard'],
        },
    } as IPenguin,
    '1155': {
        identifier: penguinIdentifier,
        name: 'Penguin #1155',
        nonce: new Nonce(1155),
        score: 177,
        purchaseDate: new Date('2020-01-01'),
        thumbnailCID: 'QmSLvDdsZ9GPC9VcvdGdfSbRVvxoMwfMdXPgmWeafzbMgy',
        equippedItems: {
            'background': placeholdersItems.background['Dark Blue'],
            'eyes': placeholdersItems.eyes['Black'],
            'skin': placeholdersItems.skin['Black'],
            'weapon': placeholdersItems.weapon['Fishing Rifle'],
        }
    } as IPenguin,
    '4782': {
        identifier: penguinIdentifier,
        name: 'Penguin #4782',
        nonce: new Nonce(4782),
        score: 9814,
        purchaseDate: new Date('2022-01-01'),
        thumbnailCID: 'QmXMKmMguQFhXqx7qdCLnDhB9AFhyFYpMmBPMyHBqc2w8p',
        equippedItems: {
            'background': placeholdersItems.background['Red'],
            'beak': placeholdersItems.beak['Pipe'],
            'clothes': placeholdersItems.clothes['Red Lifejacket'],
            'eyes': placeholdersItems.eyes['Red'],
            'skin': placeholdersItems.skin['Light Frozen'],
            'weapon': placeholdersItems.weapon['Axe'],
        }
    } as IPenguin
};

export const placeholdersEggs = {
    "silver": {
        tier: "silver",
        name: "Silver Egg",
        thumbnailCID: "Qmf1wozzDedttcoiK1pVLK661TWVex7L5sTqvJWMsZmcH7"
    } as IEgg,
    "gold": {
        tier: "gold",
        name: "Gold Egg",
        thumbnailCID: "QmazDkqCzntKtrQvH5sUY5urMCV24dyERk1USqoB341KUa"
    } as IEgg,
    "diamond": {
        tier: "diamond",
        name: "Diamond Egg",
        thumbnailCID: "QmZuTbytMW4Mr3v448buqHhqCgHdducBepnBVXQbPJuZqe"
    } as IEgg
}