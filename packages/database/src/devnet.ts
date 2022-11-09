import ItemsDatabase from "./ItemsDatabase";
import DeployDevnet from "./json/deploy.devnet.json";
import Items from "./json/items.json";

const devnetConfig = {

    itemsDatabase: ItemsDatabase.fromJson(Items, DeployDevnet.items),
    penguinsIdentifier: DeployDevnet.penguinsIdentifier,
    itemsIdentifier: DeployDevnet.itemsIdentifier,
    /**
     * @deprecated please use ItemsDatabase instead
     */
    items: Items,
    customisationContractAddress: DeployDevnet.customizationContractAddress.bech32,
    penguinsCount: 5555,
    sellingContract: "erd1qqqqqqqqqqqqqpgqxygtu607umpgtnp3xwkskeqsyhc26ej0v4xqyglrkj",
    stakingContract: "erd1qqqqqqqqqqqqqpgqdcjdvpvncw7s8ug56rehyvl8tehk3vl368mqxa7llg",
    nftStakingToken: "TEST-17e1db",
    originalTokensAmountInStakingSc: 1000000, //Todo : Find a better way to calculate tokens generated
};

Object.freeze(devnetConfig);

export default devnetConfig;