import pinataSDK, { PinataClient } from '@pinata/sdk';
import rateLimit, { RateLimitedAxiosInstance } from 'axios-rate-limit';
import Bottleneck from 'bottleneck';
import fs from "fs";
import axios from "axios";
import { sleep } from 'ts-apc-utils';

const pinataMaxRPS = 30 - 3; // pinata's limit | -3 for safety
const pinataMinTime = 1 / pinataMaxRPS * 1000;

export class PinataPin {

    private readonly _pinataClient: PinataClient;
    private readonly _apiKey: string;
    private readonly _secretApiKey: string;
    private readonly _pinFolder: string;
    private readonly _pinLimiter: Bottleneck;
    private readonly _isPinnedLimiter: RateLimitedAxiosInstance; // we use RateLimitedAxiosInstance before Bottleneck creates a memory leak
    private readonly _outputExtension: string;

    constructor(pinataApiKey: string, pinataSecretApiKey: string, pinFolder: string, outputExtension: string = "jpeg") {
        this._apiKey = pinataApiKey;
        this._secretApiKey = pinataSecretApiKey;
        this._pinFolder = pinFolder;
        this._outputExtension = outputExtension;

        this._pinataClient = pinataSDK(pinataApiKey, pinataSecretApiKey);
        this._pinLimiter = new Bottleneck({
            maxConcurrent: 3,
            minTime: pinataMinTime,
        });

        this._isPinnedLimiter = rateLimit(axios.create(), {
            maxRequests: 2,
            maxRPS: pinataMinTime
        })
    }

    public testAuthentication() {
        return this._pinataClient.testAuthentication();
    }

    public async multiplePin(cids: { imageBuffer: Buffer, cid: string }[]) {
        const promises = cids.map(({ imageBuffer, cid }) => this.pin(imageBuffer, cid));
        return Promise.all(promises);
    }

    public async pin(buffer: Buffer, cid: string) {

        if (await this.isPinned(cid)) return;

        const path = await this.writeInPinFolder(cid, buffer);

        console.log(`Pinned ${cid.grey}`);

        return this._pinLimiter.schedule(this._pinataClient.pinFromFS, path);
    }

    private async writeInPinFolder(cid: string, buffer: Buffer) {
        if (!fs.existsSync(this._pinFolder)) {
            fs.mkdirSync(this._pinFolder);
        }

        const path = `${this._pinFolder}/${cid}.${this._outputExtension}`;
        fs.writeFileSync(path, buffer);
        await sleep(500);
        return path;
    }

    public async isPinned(cid: string): Promise<boolean> {

        const pinList = await this._isPinnedLimiter.get(`https://api.pinata.cloud/data/pinList?hashContains=${cid}&status=pinned`,
            {
                withCredentials: true,
                headers: {
                    'pinata_api_key': this._apiKey,
                    'pinata_secret_api_key': this._secretApiKey
                }
            });

        return pinList.data.count > 0;
    }
}