import { capitalize } from "ts-apc-utils";

export default class RenderAttributes {

    private readonly _itemsBySlot: Map<string, string>;

    constructor(itemsBySlot: Iterable<readonly [string, string]>) {
        this._itemsBySlot = new Map<string, string>(itemsBySlot);
    }

    public toAttributes() {

        return Array.from(this._itemsBySlot.entries())
            .map(entry => capitalize(entry[0]) + ":" + capitalize(entry[1].replace("-", " ")))
            .join(";");
    }

    public hasSlot(slot: string): boolean {
        return this._itemsBySlot.has(slot);
    }
}