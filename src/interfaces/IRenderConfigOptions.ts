import ImageMIMEType from "../enums/ImageMIMEType";

export default interface IRenderConfigOptions {
    itemsCID: { [key: string]: { [key: string]: string } };

    layersOrder?: string[];
    ipfsGateway?: string;

    ipfsCacheFolder?: string;
    renderMIMEType?: ImageMIMEType;
    defaultLayers?: { [key: string]: string };
}

