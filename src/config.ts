import BadgePlugin from "./classes/plugins/badgePlugin/BadgePlugin";
import Resize2DImage from "./classes/plugins/Resize2DImage/Resize2DImage";
import ImageMIMEType from "./enums/ImageMIMEType";
import IPlugin from "./interfaces/IPlugin";
import IRenderConfigOptions from "./interfaces/IRenderConfigOptions";
import items from "./databases/items.json";

export const userConfig: IRenderConfigOptions = {
    ipfsGateway: "https://apc.mypinata.cloud/ipfs/",
    renderMIMEType: ImageMIMEType.JPEG,
    itemsCID: (() => {

        const itemsCID = {} as { [key: string]: { [key: string]: string; }; };

        for (const item of items) {
            if (!itemsCID[item.slot]) itemsCID[item.slot] = {};
            itemsCID[item.slot][item.id] = item.renderCID;
        }

        return itemsCID
    })(),
    layersOrder: [
        "background",
        "weapon",
        "skin",
        "clothes",
        "beak",
        "hat",
        "eyes",
        "badge",
    ],
    defaultLayers: {
        "background": "1",
        "beak": "18",
        "eyes": "112",
        "skin": "181",
    },

};

export const userPlugins: IPlugin[] = [
    new BadgePlugin(
        {
            badgesFolderCID: "QmQyu1jfTbqnQ5MCdZ7iYUWx6h2KP4a922WZnboBuveqAa",
            badgePrefix: "badges-",
            badgeSuffix: "-render.png",
            deleteBadgeIfSlotsEquipped: [
                "skin"
            ]
        }
    ),
    new Resize2DImage(
        1024,
        1024
    ),
]
