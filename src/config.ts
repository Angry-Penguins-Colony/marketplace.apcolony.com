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
            itemsCID[item.slot][item.id] = item.id;
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
    ],
    defaultLayers: {
        "background": "Qmc1rfcs7w7wRs2Ey8GXsfGFA5GhSULiJ9yvQvxwBmVpay",
        "beak": "Qmamqckr2cpqfXGfDroDZTY61k9by2tYAsw1HeBKEcAg8n",
        "eyes": "QmaapjJRWBzUvgGfJLdkFtjdBRZCvyPkv7oSM9xxbehDJq",
        "skin": "QmdBbSbwW9Ho7Yk2sKLnV8bbvrwLzJfhLUejQpH7CvGkik",
    },

};

export const userPlugins: IPlugin[] = [
    new Resize2DImage(
        1024,
        1024
    ),
]
