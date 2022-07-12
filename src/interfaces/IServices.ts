import RenderConfig from "../classes/RenderConfig";
import IPFSCache from "../classes/ipfscache";

export default interface IServices {
    config: RenderConfig;
    ipfsCache: IPFSCache;
}