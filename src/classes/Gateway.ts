import { CIDKvp } from "../structs/CIDKvp";
import RenderAttributes from "../structs/RenderAttributes";

export default class Gateway {

    private readonly _url: string;

    constructor(url: string) {
        this._url = url;
    }

    public async getToBuildQueue(): Promise<RenderAttributes[]> {
        throw new Error("Method not implemented.");
    }

    public async setCid(cid: CIDKvp[]): Promise<{
        hash: string;
        nonce: number;
    }> {
        throw new Error("Method not implemented.");
    }
}