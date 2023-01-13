import { Nonce } from "@elrondnetwork/erdjs-network-providers/out/primitives";
import { EggsDatabase } from "./EggsDatabase";
import ItemsDatabase from "./ItemsDatabase";
import Items from "./json/items.json";
import { Config, ItemsCollections } from "./types/config";


const eggsCollection = "EGGS-502867";
const itemsDatabase = ItemsDatabase.fromJson(Items, false);

const mainnetConfig: Config = {

    itemsDatabase: itemsDatabase,
    eggsDatabase: new EggsDatabase(eggsCollection),

    penguinsCollection: "APC-928458",
    eggsCollection: eggsCollection,
    itemsCollections: itemsDatabase.getUniqueItemsCollections(),

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