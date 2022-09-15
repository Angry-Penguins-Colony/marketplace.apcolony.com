import BadgePlugin from "./classes/plugins/badgePlugin/BadgePlugin";
import Resize2DImage from "./classes/plugins/Resize2DImage/Resize2DImage";
import ImageMIMEType from "./enums/ImageMIMEType";
import IPlugin from "./interfaces/IPlugin";
import IRenderConfigOptions from "./interfaces/IRenderConfigOptions";

export const userConfig: IRenderConfigOptions = {
    ipfsGateway: "https://apc.mypinata.cloud/ipfs/",
    renderMIMEType: ImageMIMEType.JPEG,
    itemsCID: {
        "background": {
            "1": "QmasaaTYGqaLhuhqMTxr2FzbgTY2cr9azafhQiJHrQ6usy",
            "4": "QmTgrqNQurCrLPY1pTprTiVWY4sPrUxdfn5prvrmeJdKmB",
            "7": "QmPNZo4QmzeUb5xydV3V9fxk31LHvWj1Tv5aJq8Att7VGn"
        },
        "beak": {
            "18": "Qmamqckr2cpqfXGfDroDZTY61k9by2tYAsw1HeBKEcAg8n",
            "19": "QmdJzrkK17skt18SYT5dLQpNFNnnbMPAh3nkVUf9Fnv4X9"
        },
        "clothes": {
            "77": "Qmbgir4YBAfKwQt57RtBxuM2wBLjBFw6DUAsszNYzTnEzH"
        },
        "eyes": {
            "112": "QmaapjJRWBzUvgGfJLdkFtjdBRZCvyPkv7oSM9xxbehDJq",
            "118": "QmQrmdbuTeC648nVcn3vpj3d8zpfi2dPfred2joHMEpsrn",
            "120": "QmUFvpJXRnmrxyrVHcJ1G4Na6xuC3y6q4rzg3zCzS8NcQz"
        },
        "hat": {

        },
        "skin": {
            "172": "Qmf6SFCsUpbWw6kNnTE8fKPd8diVegLDAFzWsjKzQHitGk",
            "181": "QmdBbSbwW9Ho7Yk2sKLnV8bbvrwLzJfhLUejQpH7CvGkik"
        },
        "weapon": {
            "210": "QmTjFTG8eQHBHsfwBDWtpkDVSLwwWQbk9FA5XpRqeiqWaG"
        }
    },
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
