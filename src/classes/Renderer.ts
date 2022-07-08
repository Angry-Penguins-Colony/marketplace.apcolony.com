import RenderAttributes from "../structs/RenderAttributes";
import IRender from "../interfaces/IRender";

export default class Renderer implements IRender {
    getCID(attributes: RenderAttributes): Promise<string> {
        throw new Error("Method not implemented.");
    }
}