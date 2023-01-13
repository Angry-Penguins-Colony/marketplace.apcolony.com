import { Nonce } from "@elrondnetwork/erdjs-network-providers/out/primitives";
import { EggsDatabase } from "./EggsDatabase";
import ItemsDatabase from "./ItemsDatabase";
import Items from "./json/items.json";
import { Config, ItemsCollections } from "./types/config";


const eggsCollection = "EGGS-502867";
const mainnetConfig: Config = {

    itemsDatabase: ItemsDatabase.fromJson(Items, false),
    eggsDatabase: new EggsDatabase(eggsCollection),

    penguinsCollection: "APC-928458",
    eggsCollection: eggsCollection,
    itemsCollections: getItemsIdentifiers(),

    customisationContractAddress: "erd1qqqqqqqqqqqqqpgqfpwpevmk6k8lqv7kp7m3tguql49sxjpnsc2s7lgkgn",
    penguinsCount: 5555,
    sellingContract: "erd1qqqqqqqqqqqqqpgqd42nhklsaf3pyfqs8je7pmmk8qs8gjwusc2s5hvhkj",
    /**
     * THE STAKING CONTRACT IS NOT YET DEPLOYED ON MAINNET
     */
    stakingContract: "erd1qqqqqqqqqqqqqpgqd42nhklsaf3pyfqs8je7pmmk8qs8gjwusc2s5hvhkj",
    nftStakingToken: "unset",
    originalTokensAmountInStakingSc: -1, //Todo : Find a better way to calculate tokens generated
};

Object.freeze(mainnetConfig);

export default mainnetConfig;


function getItemsIdentifiers(): ItemsCollections {

    const identifiers: ItemsCollections = {
        "background": [],
        "beak": [],
        "clothes": [],
        "eyes": [],
        "hat": [],
        "skin": [],
        "weapon": [],
    };

    for (const item of Items) {
        if (!item.collection) continue;
        addCollection(item.slot, item.collection);
    }

    return identifiers;

    function addCollection(slot: string, identifier: string) {

        const currentArray = identifiers[slot as keyof typeof identifiers] || [];

        // make sure there is no duplicates
        if (currentArray.includes(identifier)) return;

        currentArray.push(identifier);

        identifiers[slot as keyof typeof identifiers] = currentArray;
    }
}