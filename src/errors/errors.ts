export class MissingConfigFile extends Error {
    constructor(filename: string) {
        super(`The configuration file ${filename} is missing.`);
    }
}

export class MissingIpfsGateway extends Error {
    constructor() {
        super("Missing IPFS gateway");
    }
}

export class MissingCID extends Error {
    constructor(slot: string, item: string) {
        super(`Missing CID for item ${item} at slot ${slot}.`);
    }
}

export class EmptyItemName extends Error {
    constructor(slot: string, cid: string) {
        super(`Empty item name at slot ${slot}, associated with cid ${cid}.`);
    }
}

export class MissingPropertyInConfigFile extends Error {
    constructor(property: string) {
        super(`Missing property ${property} in configuration file.`);
    }
}

export class NotABooleanPropertyInConfigFile extends Error {
    constructor(property: string) {
        super(`Property ${property} is not a boolean in configuration file. Please use true or false.`);
    }
}