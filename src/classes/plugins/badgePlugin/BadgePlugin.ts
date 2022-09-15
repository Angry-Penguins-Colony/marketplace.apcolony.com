import IRenderConfigOptions from "../../../interfaces/IRenderConfigOptions";
import RenderAttributes from "../../RenderAttributes";
import { MissingSlot } from "../../../errors/configErrors";
import { pad } from "../../../utils/utils";
import IPlugin from "../../../interfaces/IPlugin";
import { CannotSetBadgeInDefaultLayers, CannotUseBadgeAsSlotName } from "./errors";
import IBadgeConfig from "./IBadgeConfig";
import IServices from "../../../interfaces/IServices";


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

    getCID(slot: string, itemName: string): string | undefined {

        if (slot == this.badgeSlotName) {
            return this.getBadgeCID(parseInt(itemName));
        }
        else {
            return undefined;
        }
    }

    getBadgeCID(number: number): string {
        const cid = this.config.badgesFolderCID + "/" + this.config.badgePrefix + pad(number, 5) + this.config.badgeSuffix;
        return cid;
    }

    checkConfig(config: IRenderConfigOptions): boolean {
        if (config.itemsCID[this.badgeSlotName] != undefined) {
            throw new CannotUseBadgeAsSlotName(this.badgeSlotName);
        }

        if (config.layersOrder && config.layersOrder.includes(this.badgeSlotName) == false) {
            throw new MissingSlot(this.badgeSlotName, "layersOrder");
        }

        if (config.defaultLayers && config.defaultLayers[this.badgeSlotName] != undefined) throw new CannotSetBadgeInDefaultLayers(this.badgeSlotName);

        return true;
    }

    async beforeRender(renderAttributes: RenderAttributes, services: IServices): Promise<RenderAttributes> {
        if (renderAttributes.hasSlot(this.badgeSlotName) == false) return renderAttributes;

        renderAttributes = this.tryUnequipBadge(renderAttributes) ?? renderAttributes;

        if (renderAttributes.hasSlot(this.badgeSlotName) == true) {

            const item = renderAttributes.getItem(this.badgeSlotName);
            const cid = this.getBadgeCID(parseInt(item));

            await services.ipfsCache.downloadCID(cid);
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

        const itemsBySlots = renderAttributes.idsBySlot;

        // iter itemsBySlot
        for (const [slot] of itemsBySlots) {
            if (deleteBadge.includes(slot) && !renderAttributes.doEquipDefaultItem(slot)) {
                itemsBySlots.delete(this.badgeSlotName);
                return new RenderAttributes(itemsBySlots, renderAttributes.layersOrder, renderAttributes.defaultLayers);
            }
        }
    }
}