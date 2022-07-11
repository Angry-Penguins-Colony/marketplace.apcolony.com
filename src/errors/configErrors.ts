export class MissingSlot extends Error {
    constructor(missingLayers: string, propertyName: string) {
        super(`Missing slot in ${propertyName}: ${missingLayers}`);
    }
}

export class UnknownSlot extends Error {
    constructor(slot: string, propertyName: string) {
        super(`Missing slot ${slot} in property itemsCID of config file. It is used in ${propertyName} in the config file.`);
    }
}

export class UnknownItem extends Error {
    constructor(unexistingItems: string, propertyName: string) {
        super(`Missing items ${unexistingItems} in property itemsCID of config file. It is used in ${propertyName} in the config file.`);
    }
}