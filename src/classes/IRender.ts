import RenderAttributes from "../structs/RenderAttributes";

export default interface IRender {
    getCID(attributes: RenderAttributes): Promise<string>;
}