import Resize2DImage from "./classes/plugins/Resize2DImage/Resize2DImage";
import ImageMIMEType from "./enums/ImageMIMEType";
import items from "./databases/items.json";
import RenderConfig from "./classes/RenderConfig";

const itemsCid = (() => {

    const itemsCID = {} as { [key: string]: { [key: string]: string; }; };

    for (const item of items) {
        if (!itemsCID[item.slot]) itemsCID[item.slot] = {};
        itemsCID[item.slot][item.id] = item.id;
    }

    return itemsCID
})();

export const renderConfig = new RenderConfig(
    {
        renderMIMEType: ImageMIMEType.JPEG,
        itemsCID: itemsCid,
        layersOrder: [
            "background",
            "weapon",
            "skin",
            "clothes",
            "beak",
            "hat",
            "eyes",
        ],
        defaultLayers: {
            "background": "default-background",
            "beak": "default-beak",
            "eyes": "default-eyes",
            "skin": "default-skin",
        },

    },
    [
        new Resize2DImage(
            1024,
            1024
        ),
    ]
)