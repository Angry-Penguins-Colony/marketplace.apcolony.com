import RenderAttributes from "@apcolony/renderer/dist/classes/RenderAttributes";


export interface IItemToProcess {
    cid: string;
    attributes: RenderAttributes;
    imageBuffer: Buffer;
}
