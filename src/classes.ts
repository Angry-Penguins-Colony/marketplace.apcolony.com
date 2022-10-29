import { iterablesSlots } from "./type";

export class Attributes {

    private _map = new Map<string, string>();

    constructor(entries?: { [key: string]: string }) {
        if (entries) {
            for (const key in entries) {
                this.set(key, entries[key]);
            }
        }
    }

    public get(slot: string): string | undefined {
        return this._map.get(slot.toLowerCase());
    }

    public set(slot: string, item: string) {
        this._map.set(slot.toLowerCase(), item);
    }

    public static fromEndpointArgument(str: string) {

        const entries = str.split(";")
            .map(entry => entry.split(":"));

        const map: { [key: string]: string } = {};

        for (const [slot, item] of entries) {
            map[slot] = item;
        }

        return new Attributes(map);
    }

    public toEndpointArgument() {

        const entries = Array.from(this._map.entries());


        for (const slot of iterablesSlots) {
            if (!this._map.has(slot)) {
                entries.push([slot, "unequipped"]);
            }
        }

        return entries
            .map(([slot, item]) => `${capitalizeSlot(slot)}:${item}`).join(";");

        function capitalizeSlot(slot: string) {
            return slot.charAt(0).toUpperCase() + slot.slice(1);
        }
    }

    public toApiParameters(): string {

        if (this._map.size == 0) return "";


        const entries = Array.from(this._map.entries());

        return entries
            .map(([slot, item]) => `${slot}=${item.replace(" ", "%20")}`)
            .join("&");
    }

    public equals(other: Attributes): boolean {

        const map1 = this._map;
        const map2 = other._map;

        const uniqueSlots = new Set([...map1.keys(), ...map2.keys()]);

        for (const slot of uniqueSlots) {
            const value1 = map1.get(slot) == "unequipped" ? undefined : map1.get(slot);
            const value2 = map2.get(slot) == "unequipped" ? undefined : map2.get(slot);

            if (value1 != value2) {
                return false;
            }
        }
        return true;
    }
}