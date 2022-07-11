import IConfigOptions from "../IConfigOptions";
import RenderAttributes from "../RenderAttributes";

export default interface IPlugin {

    /**
     * A plugin can create a layer that is not in the config, 
     * but needed to be in layers orders (like badge slot of BadgePlugin).
     */
    ownLayers?: string[];
    /**
     * Throw error if a badly configured.
     */
    checkConfig?(config: IConfigOptions): void;


    afterPrimarySetup?(workers: import("cluster").Worker[]): void;

    /**
     * Override the CID for an item.
     */
    getCID?(slot: string, itemName: string): string | undefined;

    /**
     * Modify the attributes before the render
     * @param renderAttributes modified attributes
     */
    beforeRender?(renderAttributes: RenderAttributes): Promise<RenderAttributes>;

    /**
     * Called after the render is complete
     */
    modifyRender?(renderBuffer: Buffer, renderAttributes: RenderAttributes): Promise<Buffer>;

    /**
     * Called after the render is complete, and after the lateModifyRender
     */
    onRenderComplete?(renderBuffer: Buffer, renderAttributes: RenderAttributes): void;

    /**
     * Called after the render is complete, and after the onRenderComplete.
     * @param renderBuffer 
     * @param renderAttributes 
     */
    lateModifyRender?(renderBuffer: Buffer, renderAttributes: RenderAttributes): Promise<Buffer>;
}