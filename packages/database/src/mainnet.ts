import { Nonce } from "@elrondnetwork/erdjs-network-providers/out/primitives";
import ItemsDatabase, { DeployedItem, splitCollectionAndNonce } from "./ItemsDatabase";
import DeployMainnet from "./json/deploy.mainnet.json";
import Items from "./json/items.json";
import { Config, ItemsCollections } from "./types/config";


const mainnetConfig: Config = {

    itemsDatabase: ItemsDatabase.fromJson(Items, toDeployedItems()),
    penguinsCollection: "APC-928458",
    itemsCollections: getItemsIdentifiers(),
    customisationContractAddress: "erd1qqqqqqqqqqqqqpgqfpwpevmk6k8lqv7kp7m3tguql49sxjpnsc2s7lgkgn",
    penguinsCount: 5555,
    eggsCollection: "EGGS-502867",
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

    // add our own collections
    for (const id in DeployMainnet) {
        const item = DeployMainnet[id as keyof typeof DeployMainnet];
        const slot = Items.find((i) => i.id === id)?.slot;

        if (slot) {
            addCollection(slot, item.collection);
        }
    }

    for (const item of Items) {
        if (item.identifier) {
            const { collection } = splitCollectionAndNonce(item.identifier);
            addCollection(item.slot, collection);
        }
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

function toDeployedItems(): DeployedItem[] {

    const deployedItems = Object.keys(DeployMainnet).map((id) => {
        const { collection, nonce } = DeployMainnet[id as keyof typeof DeployMainnet];

        return {
            id,
            collection,
            nonce,
            identifier: `${collection}-${new Nonce(nonce).hex()}`
        };
    });

    const collabItems = Items
        .filter(({ id }) => parseInt(id) >= 1000)
        .map((item) => {
            if (!item.identifier) throw new Error(`Collab item ${item.id} has no identifier`);

            const { collection, nonce } = splitCollectionAndNonce(item.identifier);

            return {
                id: item.id,
                collection,
                nonce,
                identifier: item.identifier,
            };
        });

    return [...deployedItems, ...collabItems];
}