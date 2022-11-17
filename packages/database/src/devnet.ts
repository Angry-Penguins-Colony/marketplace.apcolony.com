import { EggsDatabase } from "./EggsDatabase";
import ItemsDatabase from "./ItemsDatabase";
import DeployDevnet from "./json/deploy.devnet.json";
import Items from "./json/items.json";
import { Config } from "./types/config";



const eggsCollection = "EGGS-e93d67";

const devnetConfig: Config = {

    itemsDatabase: ItemsDatabase.fromJson(Items, DeployDevnet.items),
    eggsDatabase: new EggsDatabase(eggsCollection),

    penguinsCollection: DeployDevnet.penguinsIdentifier,
    itemsCollections: DeployDevnet.itemsIdentifier,
    penguinsCount: 5555,
    eggsCollection: eggsCollection,
    customisationContractAddress: DeployDevnet.customizationContractAddress.bech32,
    sellingContract: "erd1qqqqqqqqqqqqqpgqxygtu607umpgtnp3xwkskeqsyhc26ej0v4xqyglrkj",
    stakingContract: "erd1qqqqqqqqqqqqqpgqdcjdvpvncw7s8ug56rehyvl8tehk3vl368mqxa7llg",
    nftStakingToken: "TEST-17e1db",
    originalTokensAmountInStakingSc: 1000000, //Todo : Find a better way to calculate tokens generated
};

Object.freeze(devnetConfig);

export default devnetConfig;