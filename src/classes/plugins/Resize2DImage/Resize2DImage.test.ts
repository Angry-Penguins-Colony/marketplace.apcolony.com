import { BadRenderResolution } from "./errors";
import Resize2DImage from "./Resize2DImage"

describe("ctor errors", () => {

    it("not throw error if renderResX and renderResY greater than 0", () => {
        expect(() => new Resize2DImage(100, 100))
            .not.toThrowError(BadRenderResolution);
    })

    it("throw error if renderResX is zero", () => {
        expect(() => new Resize2DImage(0, 100))
            .toThrowError(BadRenderResolution);
    })

    it("throw error if renderResY is zero", () => {
        expect(() => new Resize2DImage(100, 0))
            .toThrowError(BadRenderResolution);
    })

    it("throw error if renderResX is negative", () => {
        expect(() => new Resize2DImage(-100, 100))
            .toThrowError(BadRenderResolution);
    })

    it("throw error if renderResY is negative", () => {
        expect(() => new Resize2DImage(100, -100))
            .toThrowError(BadRenderResolution);
    })
})