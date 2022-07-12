import RenderAttributes from "../classes/RenderAttributes";

type ItemsCID = {
    [key: string]: {
        [key: string]: string;
    };
};

export function getRandomAttributes(
    itemsCID: ItemsCID,
    layersOrder: string[],
    defaultLayers?: { [key: string]: string }
): RenderAttributes {

    const itemsBySlot = new Map<string, string>();
    const slots = getRandomSlots(itemsCID);

    for (const slot of slots) {
        const item = getRandomItem(slot, itemsCID);
        itemsBySlot.set(slot, item);
    }

    return new RenderAttributes(itemsBySlot, layersOrder, defaultLayers);
}

export function getRandomSlots(itemsCID: ItemsCID): string[] {


    const totalSlotAmount = Object.keys(itemsCID).length;
    const randomSlotAmount = Math.floor(Math.random() * totalSlotAmount) + 1;

    const remainingSlots = Object.keys(itemsCID);

    const randomSlots = [];

    for (let i = 0; i < randomSlotAmount; i++) {
        const randomSlot = remainingSlots[Math.floor(Math.random() * remainingSlots.length)];
        randomSlots.push(randomSlot);
        remainingSlots.splice(remainingSlots.indexOf(randomSlot), 1);
    }

    return randomSlots;
}

export function getRandomItem(slot: string, itemsCID: ItemsCID): string {
    const items = Object.keys(itemsCID[slot]);
    const randomIndex = Math.floor(Math.random() * items.length);

    return items[randomIndex];
}