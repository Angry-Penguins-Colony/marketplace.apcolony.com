import { EggsDatabase } from "../EggsDatabase";
import ItemsDatabase from "../ItemsDatabase";

export interface Config {
    itemsDatabase: ItemsDatabase;
    eggsDatabase: EggsDatabase;


    penguinsCollection: string;
    itemsCollections: ItemsCollections;
    eggsCollection: string;

    penguinsCount: number;
    nftStakingToken: string;
    originalTokensAmountInStakingSc: number;

    customisationContractAddress: string;
    sellingContract: string;
    stakingContract: string;
    dropsContract: string;
}

export interface ItemsCollections {
    background: string[];
    beak: string[];
    clothes: string[];
    eyes: string[];
    hat: string[];
    skin: string[];
    weapon: string[];
}