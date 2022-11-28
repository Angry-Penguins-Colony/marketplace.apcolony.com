import { Slot } from "./type";

export function slotToPlural(slot: Slot) {
    switch (slot) {
        case "background":
            return "backgrounds";

        case "beak":
            return "beaks";

        case "clothes":
            return "clothes";

        case "eyes":
            return "eyes";

        case "hat":
            return "hats";

        case "skin":
            return "skins";

        case "weapon":
            return "weapons";

        default:
            throw new Error(`Unknown slot: ${slot}`);
    }
}