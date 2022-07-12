import IPlugin from "@apc/renderer/dist/interfaces/IPlugin";
import BadgePlugin from "@apc/renderer/dist/classes/plugins/badgePlugin/BadgePlugin";
import Resize2DImage from "@apc/renderer/dist/classes/plugins/Resize2DImage/Resize2DImage";

export const renderConfigPlugins: IPlugin[] = [
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