export class BadRenderResolution extends Error {
    constructor() {
        super(`Render resolution cannot be zero or negative.`);
    }
}