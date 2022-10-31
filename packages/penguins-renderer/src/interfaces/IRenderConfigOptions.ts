import ImageMIMEType from '../enums/ImageMIMEType';

export interface IRenderConfigOptions {
    itemsCID: { [key: string]: { [key: string]: string; }; };

    layersOrder?: string[];

    renderMIMEType?: ImageMIMEType;
    defaultLayers?: { [key: string]: string; };
}
