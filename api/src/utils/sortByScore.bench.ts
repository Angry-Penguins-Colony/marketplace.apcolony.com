import { IItem, IPenguin } from "@apcolony/marketplace-api";
import Benchmark from "benchmark";
import { itemsDatabase } from "../const";
import { sortByScore } from "./sortByScore";

const suite = new Benchmark.Suite;
const penguins = generateRandomsPenguins(5_555);

suite
    .add('sortByScore', () => {
        sortByScore(penguins, itemsDatabase)
    })
    // add listeners
    .on('cycle', function (event: any) {
        console.log(String(event.target));
    })
    // run async
    .run({ 'async': true });


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