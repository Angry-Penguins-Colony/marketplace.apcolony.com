import RenderAttributes from "@apc/renderer/dist/classes/RenderAttributes";


export interface IRenderOutput {
    cid: string;
    attributes: RenderAttributes;
    imageBuffer: Buffer;
}
