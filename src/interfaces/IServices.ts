import RenderConfig from "../classes/RenderConfig";
import ImagesDownloader from "../classes/ImagesDownloader";

export default interface IServices {
    config: RenderConfig;
    ipfsCache: ImagesDownloader;
}