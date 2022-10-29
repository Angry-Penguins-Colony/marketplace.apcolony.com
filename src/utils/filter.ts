import { IOffer } from "@apcolony/marketplace-api";
import { penguinsCollection } from "../const";

export function filterOffers(offers: IOffer[]) {
    const penguinsOffers = [];
    const itemsOffers = [];

    for (const offer of offers) {
        if (offer.collection === penguinsCollection) {
            penguinsOffers.push(offer);
        } else {
            itemsOffers.push(offer);
        }
    }

    return {
        penguinsOffers,
        itemsOffers
    };
}