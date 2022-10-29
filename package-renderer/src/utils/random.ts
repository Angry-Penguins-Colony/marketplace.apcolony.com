type ItemsCID = {
    [key: string]: {
        [key: string]: string;
    };
};

export function getRandomAttributes(
    itemsCID: ItemsCID,
    notIncludedIds?: string[]
): Map<string, string> {
    const itemsBySlot = new Map<string, string>();
    const slots = getRandomSlots(itemsCID);

    for (const slot of slots) {
        const item = getRandomItem(slot, itemsCID, notIncludedIds);

        if (item) {
            itemsBySlot.set(slot, item);
        }
    }

    return itemsBySlot;
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

export function getRandomItem(slot: string, itemsCID: ItemsCID, notIncludedIds?: string[]) {
    const items = Object.keys(itemsCID[slot])
        .filter((item) => !notIncludedIds || !notIncludedIds.includes(item));

    if (items.length == 0) return undefined;

    const randomIndex = Math.floor(Math.random() * items.length);

    return items[randomIndex];
}