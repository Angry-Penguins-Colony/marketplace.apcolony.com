import BadgePlugin from "./src/classes/plugins/badgePlugin/BadgePlugin";
import Resize2DImage from "./src/classes/plugins/Resize2DImage/Resize2DImage";
import 'dotenv/config'
import IPlugin from "./src/classes/plugins/IPlugin";

export const plugins: IPlugin[] = [
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