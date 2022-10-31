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
};

Object.freeze(devnetConfig);

export default devnetConfig;