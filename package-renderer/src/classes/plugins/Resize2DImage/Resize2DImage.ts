import IPlugin from "../../../interfaces/IPlugin";
import sharp from 'sharp';
import { BadRenderResolution } from "./errors";

export default class Resize2DImage implements IPlugin {

    private readonly resizeResolutionX: number;
    private readonly resizeResolutionY: number;

    constructor(resizeResolutionX: number, resizeResolutionY: number) {

        if (resizeResolutionX <= 0 || resizeResolutionY <= 0) throw new BadRenderResolution();

        this.resizeResolutionX = resizeResolutionX;
        this.resizeResolutionY = resizeResolutionY;
    }

    async lateModifyRender(imageBuffer: Buffer): Promise<Buffer> {

        return await sharp(imageBuffer)
            .resize(this.resizeResolutionX, this.resizeResolutionY)
            .toBuffer();
    }
}