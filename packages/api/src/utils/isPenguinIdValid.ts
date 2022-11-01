import { penguinsCount } from "../const";

export function isPenguinIdValid(rawId: string) {
    const id = parseInt(rawId);

    return isNaN(id) == false && id >= 1 && id <= penguinsCount;
}
