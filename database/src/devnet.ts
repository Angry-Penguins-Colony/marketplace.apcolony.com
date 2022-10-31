import ItemsDatabase from "./ItemsDatabase";
import DeployDevnet from "./json/deploy.devnet.json";
import Items from "./json/items.json";

export const itemsDatabase = ItemsDatabase.fromJson(Items, DeployDevnet.items);
export const penguinsIdentifier = DeployDevnet.penguinsIdentifier;
export const itemsIdentifier = DeployDevnet.itemsIdentifier;
/**
 * @deprecated please use ItemsDatabase instead
 */
export const items = Items;
export const customisationContractAddress = DeployDevnet.customizationContractAddress.bech32;