import IConfigOptions from "../../IConfigOptions";
import RenderAttributes from "../../RenderAttributes";
import { MissingSlot } from "../../../errors/configErrors";
import { pad } from "../../../utils/utils";
import IPlugin from "../IPlugin";
import { CannotSetBadgeInDefaultLayers, CannotUseBadgeAsSlotName } from "./errors";
import IBadgeConfig from "./IBadgeConfig";


export default class BadgePlugin implements IPlugin {

    private readonly config: IBadgeConfig;

    constructor(config: IBadgeConfig) {
        this.config = config;
    }

    public get badgeSlotName() {
        return this.config.badgeSlotName ?? "badge";
    }

    public get ownLayers() {
        return [this.badgeSlotName];
    }

    isSyncPlugin() {
        return false;
    }

    getCID(slot: string, itemName: string): string | undefined {

        if (slot == this.badgeSlotName) {
            const cid = this.config.badgesFolderCID + "/" + this.config.badgePrefix + pad(parseInt(itemName), 5) + this.config.badgeSuffix;
            return cid;
        }
        else {
            return undefined;
        }
    }

    checkConfig(config: IConfigOptions): boolean {
        if (config.itemsCID[this.badgeSlotName] != undefined) {
            throw new CannotUseBadgeAsSlotName(this.badgeSlotName);
        }

        if (config.layersOrder && config.layersOrder.includes(this.badgeSlotName) == false) {
            throw new MissingSlot(this.badgeSlotName, "layersOrder");
        }

        if (config.defaultLayers && config.defaultLayers[this.badgeSlotName] != undefined) throw new CannotSetBadgeInDefaultLayers(this.badgeSlotName);

        return true;
    }

    async beforeRender(renderAttributes: RenderAttributes): Promise<RenderAttributes> {
        if (renderAttributes.hasSlot(this.badgeSlotName) == false) return renderAttributes;

        renderAttributes = this.tryUnequipBadge(renderAttributes) ?? renderAttributes;

        if (renderAttributes.hasSlot(this.badgeSlotName) == true) {
            await ipfsCache.downloadCID(renderAttributes.getCid(this.badgeSlotName));
        }

        return renderAttributes;
    }

    /**
     * 
     * @param renderAttributes 
     * @returns render attributes without badge or, if badge is not unequip, with default badge
     */
    tryUnequipBadge(renderAttributes: RenderAttributes) {
        const deleteBadge = this.config.deleteBadgeIfSlotsEquipped;

        if (deleteBadge == undefined) return renderAttributes;

        const itemsBySlots = renderAttributes.itemsBySlot;

        // iter itemsBySlot
        for (const [slot] of itemsBySlots) {
            if (deleteBadge.includes(slot) && !renderAttributes.doEquipDefaultItem(slot)) {
                itemsBySlots.delete(this.badgeSlotName);
                return new RenderAttributes(itemsBySlots, renderAttributes.config);
            }
        }
    }
}