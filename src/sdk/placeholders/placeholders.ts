import { Nonce } from '@elrondnetwork/erdjs/out';
import Slotname from 'sdk/Slotname';

export const placeholdersItems = {
    background: {
        'Blue Gradient': {
            identifier: 'BG-a1a1a1',
            nonce: new Nonce(1),
            slot: new Slotname('background'),
            name: 'Blue Gradient',
            thumbnailCID: '',
        },
        'Dark Blue': {
            identifier: 'BG-a1a1a1',
            nonce: new Nonce(2),
            slot: new Slotname('background'),
            name: 'Dark Blue',
            thumbnailCID: '',
        },
        'Red': {
            identifier: 'BG-a1a1a1',
            nonce: new Nonce(3),
            slot: new Slotname('background'),
            name: 'Red',
            thumbnailCID: '',
        }
    },
    beak: {
        'Straw': {
            identifier: 'BEAK-a1a1a1',
            nonce: new Nonce(1),
            slot: new Slotname('beak'),
            name: 'Straw',
            thumbnailCID: '',
        },
        'Pipe': {
            identifier: 'BEAK-a1a1a1',
            nonce: new Nonce(2),
            slot: new Slotname('beak'),
            name: 'Pipe',
            thumbnailCID: '',
        }
    },
    clothes: {
        'Coat With Brown Fur': {
            identifier: 'CLOTHES-a1a1a1',
            nonce: new Nonce(1),
            slot: new Slotname('clothes'),
            name: 'Coat With Brown Fur',
            thumbnailCID: '',
        },
        'Red Lifejacket': {
            identifier: 'CLOTHES-a1a1a1',
            nonce: new Nonce(2),
            slot: new Slotname('clothes'),
            name: 'Red Lifejacket',
            thumbnailCID: '',
        },
    },
    eyes: {
        'Black': {
            identifier: 'EYES-a1a1a1',
            nonce: new Nonce(1),
            slot: new Slotname('eyes'),
            name: 'Black',
            thumbnailCID: '',
        },
        'Red': {
            identifier: 'EYES-a1a1a1',
            nonce: new Nonce(2),
            slot: new Slotname('eyes'),
            name: 'Red',
            thumbnailCID: '',
        }
    },
    hat: {
        'Blue Bitcoin Cap': {
            identifier: 'HAT-a1a1a1',
            nonce: new Nonce(1),
            slot: new Slotname('hat'),
            name: 'Blue Bitcoin Cap',
            thumbnailCID: '',
        },
    },
    skin: {
        'Claw Marks': {
            identifier: 'SKIN-a1a1a1',
            nonce: new Nonce(1),
            slot: new Slotname('skin'),
            name: 'Claw Marks',
            thumbnailCID: '',
        },
        'Black': {
            identifier: 'SKIN-a1a1a1',
            nonce: new Nonce(2),
            slot: new Slotname('skin'),
            name: 'Black',
            thumbnailCID: '',
        },
        'Light Frozen': {
            identifier: 'SKIN-a1a1a1',
            nonce: new Nonce(3),
            slot: new Slotname('skin'),
            name: 'Light Frozen',
            thumbnailCID: '',
        }
    },
    weapon: {
        'Snowboard': {
            identifier: 'WEAPON-a1a1a1',
            nonce: new Nonce(1),
            slot: new Slotname('weapon'),
            name: 'Snowboard',
            thumbnailCID: '',
        },
        'Fishing Rifle': {
            identifier: 'WEAPON-a1a1a1',
            nonce: new Nonce(2),
            slot: new Slotname('weapon'),
            name: 'Fishing Rifle',
            thumbnailCID: '',
        },
        'Axe': {
            identifier: 'WEAPON-a1a1a1',
            nonce: new Nonce(3),
            slot: new Slotname('weapon'),
            name: 'Axe',
            thumbnailCID: '',
        }
    }
}

const penguinIdentifier = 'APC-928458';

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
        }
    },
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
    },
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
    }
};

