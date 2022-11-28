import ItemsDatabase from "@apcolony/db-marketplace/out/ItemsDatabase";
import { IPenguin } from "@apcolony/marketplace-api";

export function sortByScore(penguins: IPenguin[], itemsDatabase: ItemsDatabase) {

    return penguins
        .map(penguin => ({ ...penguin, score: itemsDatabase.calculatePenguinsScore(penguin) }))
        .sort((a, b) => b.score - a.score);

}