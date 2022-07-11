import Config from "../classes/config";
import IPFSCache from "../classes/ipfscache";

export default interface IServices {
    config: Config;
    ipfsCache: IPFSCache;
}