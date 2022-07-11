import ImageMIMEType from "../enums/ImageMIMEType";

export default interface IConfigOptions {
    itemsCID: { [key: string]: { [key: string]: string } };

    /**
     * Merge maximum request per seconds. Useful to reduce memory usage.
     */
    maxPerRequest?: number;
    maxConcurrentPerRequest?: number;
    layersOrder?: string[];
    ipfsGateway?: string;

    ipfsCacheFolder?: string;
    renderMIMEType?: ImageMIMEType;
    defaultLayers?: { [key: string]: string };
}

