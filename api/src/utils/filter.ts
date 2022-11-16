import { IOffer } from "@apcolony/marketplace-api";
import { eggsCollection, penguinsCollection } from "../const";

export function filterOffers(offers: IOffer[]) {
    const penguinsOffers = [];
    const itemsOffers = [];
    const eggsOffers = [];

    for (const offer of offers) {
        switch (offer.collection) {
            case penguinsCollection:
                penguinsOffers.push(offer);
                break;

            case eggsCollection:
                eggsOffers.push(offer);
                break;

            default:
                itemsOffers.push(offer);
                break;
        }
    }

    return {
        penguinsOffers,
        itemsOffers,
        eggsOffers
    };
}