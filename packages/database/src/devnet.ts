import { EggsDatabase } from "./EggsDatabase";
import ItemsDatabase from "./ItemsDatabase";
import DeployDevnet from "./json/deploy.devnet.json";
import Items from "./json/items.json";
import { Config } from "./types/config";



const eggsCollection = "EGGS-e93d67";

const itemsDatabase = ItemsDatabase.fromJson(Items, true);
const devnetConfig: Config = {

    itemsDatabase: itemsDatabase,
    eggsDatabase: new EggsDatabase(eggsCollection),

    penguinsCollection: DeployDevnet.penguinsIdentifier,
    itemsCollections: itemsDatabase.getUniqueItemsCollections(),
    penguinsCount: 5555,
    eggsCollection: eggsCollection,
    customisationContractAddress: DeployDevnet.customizationContractAddress.bech32,
    sellingContract: "erd1qqqqqqqqqqqqqpgqxygtu607umpgtnp3xwkskeqsyhc26ej0v4xqyglrkj",
    stakingContract: "erd1qqqqqqqqqqqqqpgq4r5lhttf3s98na2vxmk7qyk2t8qs79wt68mq0qs6z3",
    newSalesContract: "erd1qqqqqqqqqqqqqpgqnc4dk30z0jrljyl0dztz6wruphkwlmpuvqhsuy0y4h",
    nftStakingToken: "TEST-17e1db",
    originalTokensAmountInStakingSc: 1000000, //Todo : Find a better way to calculate tokens generated
};

Object.freeze(devnetConfig);

export default devnetConfig;