import { Slotname, Nonce, IPenguin, IItem, IEgg } from '@apcolony/marketplace-api/out';
import { getNetworkType } from './env';

export function getNetworkInfos() {

    if (process.env.GATEWAY) {
        // throw error if last character of gateway is a slash
        if (process.env.GATEWAY[process.env.GATEWAY.length - 1] === '/') {
            throw new Error(`Gateway should not end with a slash.`);
        }
    }

    switch (getNetworkType()) {
        case "MAINNET":
            return {
                penguinsCollection: 'APC-928458',
                gateway: process.env.GATEWAY ?? "https://gateway.elrond.com"
            };

        case "DEVNET":
            return {
                penguinsCollection: 'APC-928458',
                gateway: process.env.GATEWAY ?? "https://devnet-gateway.elrond.com"
            };
    }
}

export const penguinsCollection = getNetworkInfos().penguinsCollection;
export const gateway = getNetworkInfos().gateway;

export const placeholdersItems = {
    background: {
        'Blue Gradient': {
            identifier: 'BG-a1a1a1',
            nonce: new Nonce(1),
            slot: new Slotname('background'),
            name: 'Blue Gradient',
            description: "Classic blue gradient background.",
            thumbnailCID: 'QmVi2YhcCUn5F9TSRg57ebvo2BFGnRBqBtdrLz42L58bcZ',
        } as IItem,
        'Dark Blue': {
            identifier: 'BG-a1a1a1',
            nonce: new Nonce(2),
            slot: new Slotname('background'),
            name: 'Dark Blue',
            description: "Classic dark blue background.",
            thumbnailCID: 'QmZyZ6LmiN5hm6HNDZbwBkCDibMZBoAmw5c84y2he5tSTU',
        } as IItem,
        'Red': {
            identifier: 'BG-a1a1a1',
            nonce: new Nonce(3),
            slot: new Slotname('background'),
            name: 'Red',
            description: "Classic red background.",
            thumbnailCID: 'QmeK9oC4fxW4m2ogg64Qf5WxeppnyTScZMncqtyeD9U6eK',
        } as IItem
    },
    beak: {
        'Straw': {
            identifier: 'BEAK-a1a1a1',
            nonce: new Nonce(1),
            slot: new Slotname('beak'),
            name: 'Straw',
            description: "Among all the threats the Angry Penguins have to face.",
            thumbnailCID: 'QmNbeVsynnxm3cg1AKtZqxqAUSPyYrRtQimvoPfa3RPzBH',
        } as IItem,
        'Pipe': {
            identifier: 'BEAK-a1a1a1',
            nonce: new Nonce(2),
            slot: new Slotname('beak'),
            name: 'Pipe',
            description: "The Angry Penguins love to put on a good old classy and old-fashioned look.",
            thumbnailCID: 'QmT2CqAWc9Q5JwGqDSXjzzv1emdpfuKbBD9ZqzW69CFKf9',
        } as IItem
    },
    clothes: {
        'Coat With Brown Fur': {
            identifier: 'CLOTHES-a1a1a1',
            nonce: new Nonce(1),
            slot: new Slotname('clothes'),
            name: 'Coat With Brown Fur',
            description: "Temperatures can drop very low on the ice pack. The fur of the penguins is not always sufficient.",
            thumbnailCID: 'QmeoRwUajh5JaX2WLk9UjXDCxajTiBAzrnT7qhVuAQCGw4',
        } as IItem,
        'Red Lifejacket': {
            identifier: 'CLOTHES-a1a1a1',
            nonce: new Nonce(2),
            slot: new Slotname('clothes'),
            name: 'Red Lifejacket',
            description: "When the ocean is rough.",
            thumbnailCID: 'QmZ3x1RTybnBUQMUMufnwaDgNtQp4EA5cwL2ysXJ4FvNcR',
        } as IItem,
    },
    eyes: {
        'Black': {
            identifier: 'EYES-a1a1a1',
            nonce: new Nonce(1),
            slot: new Slotname('eyes'),
            name: 'Black',
            description: "Some Angry Penguins are darker than others. The whole Colony knows that the members who have these eyes are often selling their shitcoins in the dark market of the capital. Some of them made a fortune with them but most of their clients are now bankrupt.",
            thumbnailCID: 'QmaF7ApbEo4qRTWXKjKEeTdZQ3gHqyaUf6axs3msP6gNLf',
        } as IItem,
        'EGLD': {
            identifier: 'EYES-a1a1a1',
            nonce: new Nonce(2),
            slot: new Slotname('eyes'),
            name: 'EGLD',
            description: "We all know that the Angry Penguins live through and for the Elrond Blockchain.",
            thumbnailCID: 'QmNZvRuaA1rSopnNk2D8wsi7aqcRMLuAatnVXQE2ggFP8s',
        } as IItem
    },
    hat: {
        'Blue Bitcoin Cap': {
            identifier: 'HAT-a1a1a1',
            nonce: new Nonce(1),
            slot: new Slotname('hat'),
            name: 'Blue Bitcoin Cap',
            description: "Bitcoin will do to banks what email did to the postal industry.",
            thumbnailCID: 'QmdCnaXnhDKKfyp2mPG8HRPhogWeTYX8kNSN1AggtEXBtR',
        } as IItem,
    },
    skin: {
        'Claw Marks': {
            identifier: 'SKIN-a1a1a1',
            nonce: new Nonce(1),
            slot: new Slotname('skin'),
            name: 'Claw Marks',
            description: "Because of all the threats they encounter.",
            thumbnailCID: 'QmV9sXrNH8FaVhivT4qioSjgy3fFBFNRFhpJazoCXkfyHp',
        } as IItem,
        'Black': {
            identifier: 'SKIN-a1a1a1',
            nonce: new Nonce(2),
            slot: new Slotname('skin'),
            name: 'Black',
            description: "Living in the dark.",
            thumbnailCID: 'QmdsqCHfY2xgDnR8nMtXrpqWdB5avWUuD24HVRjRZKcf9A',
        } as IItem,
        'Light Frozen': {
            identifier: 'SKIN-a1a1a1',
            nonce: new Nonce(3),
            slot: new Slotname('skin'),
            name: 'Light Frozen',
            description: "Angry Penguins are full of surprises. Some of the best members of the colony take the look of the surrounding ice as a camouflage.",
            thumbnailCID: 'QmNw9y925o6k1YoEeUyRhSmpkQVE1DP2TndFB1H48J2TrY',
        } as IItem
    },
    weapon: {
        'Snowboard': {
            identifier: 'WEAPON-a1a1a1',
            nonce: new Nonce(1),
            slot: new Slotname('weapon'),
            name: 'Snowboard',
            description: "Who said Angry Penguins cannot have some fun? To celebrate the success of the last migration.",
            thumbnailCID: 'QmV4SxCUH9wHuDDmcUE5AEVZDLsTyGBdw58xqB6uingCoB',
        } as IItem,
        'Fishing Rifle': {
            identifier: 'WEAPON-a1a1a1',
            nonce: new Nonce(2),
            slot: new Slotname('weapon'),
            name: 'Fishing Rifle',
            description: "Even though Angry Penguins are extremely fast underwater.",
            thumbnailCID: 'QmenrrNSAkxnPy6mXqTGBnV9fxL6NrqAB2ysAYkuKgY4iM',
        } as IItem,
        'Axe': {
            identifier: 'WEAPON-a1a1a1',
            nonce: new Nonce(3),
            slot: new Slotname('weapon'),
            name: 'Axe',
            description: "Nothing beats a good old axe. It is easy to use for younger Angry Penguins and not too sophisticated for older ones.",
            thumbnailCID: 'QmRv5UYxDHLgQANRkmFHX1MJgEB6y2mS1uDmiwTCZ1tZDx',
        } as IItem
    }
}

export const placeholdersPenguins = {
    '4987': {
        identifier: penguinsCollection,
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
        identifier: penguinsCollection,
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
        identifier: penguinsCollection,
        name: 'Penguin #4782',
        nonce: new Nonce(4782),
        score: 9814,
        purchaseDate: new Date('2022-01-01'),
        thumbnailCID: 'QmXMKmMguQFhXqx7qdCLnDhB9AFhyFYpMmBPMyHBqc2w8p',
        equippedItems: {
            'background': placeholdersItems.background['Red'],
            'beak': placeholdersItems.beak['Pipe'],
            'clothes': placeholdersItems.clothes['Red Lifejacket'],
            'eyes': placeholdersItems.eyes['EGLD'],
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