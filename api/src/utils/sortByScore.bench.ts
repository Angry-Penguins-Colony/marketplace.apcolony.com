import { IItem, IPenguin } from "@apcolony/marketplace-api";
import { itemsDatabase } from "../const";
import { sortByScore } from "./sortByScore";

const penguins = generateRandomsPenguins(5_555);

runTest("Sort By Score", () => sortByScore(penguins, itemsDatabase))

function runTest(title: string, fn: () => void) {
    console.log(` ${title}  `);

    const start = Date.now();
    for (let i = 0; i < 100; i++) {
        fn();
    }
    const end = Date.now();

    console.log(` ${end - start}ms `);
}

function generateRandomsPenguins(count: number) {
    const penguins: IPenguin[] = [];


    for (let i = 0; i < count; i++) {
        const items = itemsDatabase.getRandomItems(7);

        const equippedItems: { [key: string]: IItem; } = {};

        for (const item of items) {
            equippedItems[item.type] = item;
        }


        penguins.push({
            id: i.toString(),
            type: "penguins",
            thumbnailUrls: {
                high: "",
                ipfs: "",
                small: "",
            },
            collection: `Collection ${i}`,
            displayName: `Penguin ${i}`,
            identifier: `Penguin ${i}`,
            nonce: i,
            equippedItems: equippedItems
        });
    }

    return penguins;
}