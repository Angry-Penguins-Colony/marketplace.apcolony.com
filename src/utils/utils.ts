import fs from 'fs';
import axios from "axios";
import RenderAttributes from '../classes/RenderAttributes';
import ImagesDownloader from '../classes/ImagesDownloader';
import RenderConfig from '../classes/RenderConfig';

/**
 * Download image and write to filepath. Returns also the buffer
 */
export async function downloadImage(url: string, filepath: string): Promise<Buffer> {

    const response = await axios.get(url,
        {
            responseType: 'arraybuffer',
            timeout: 30000
        });

    if (response.status == 200) {
        const buffer = Buffer.from(response.data, "base64");
        fs.writeFileSync(filepath, buffer);
        return buffer;
    }
    else {
        throw new Error(`Downloading ${url} failed With a Status Code: ${response.status}`);
    }
}

// function to encode file data to base64 encoded string
export function base64_encode(filepath: string): string {
    const bitmap = fs.readFileSync(filepath);
    return new Buffer(bitmap).toString('base64');
}


export function array_hash(a: string[]): string {
    let i, sum = 0
    for (i = 0; i < a.length; i++) {
        const cs = charsum(a[i])
        sum = sum + (65027 / cs)
    }
    return ("" + sum).slice(0, 16)
}

export function charsum(s: string): number {
    let i, sum = 0;
    for (i = 0; i < s.length; i++) {
        sum += (s.charCodeAt(i) * (i + 1));
    }
    return sum
}

// source: https://stackoverflow.com/questions/40716894/angular2-or-typescript-left-padding-a-string-with-zeros
export function pad(num: number, size: number): string {
    let s = num + "";
    while (s.length < size) s = "0" + s;
    return s;
}

export function sortImages(itemsBySlot: [string, string][], layerOrder: string[]) {

    const array_kvp = itemsBySlot
        .sort((a, b) => {
            const a_index = layerOrder.indexOf(a[0]);
            const b_index = layerOrder.indexOf(b[0]);

            if (a_index == -1) throw new Error(`Cannot sort images. Missing slot ${a[0]} in layerOrder`);
            if (b_index == -1) throw new Error(`Cannot sort images. Missing slot ${b[0]} in layerOrder`);

            if (a_index < b_index) return -1;
            if (a_index > b_index) return 1;
            return 0;
        });

    return array_kvp;
}

export function isCID(cid: string): boolean {
    return cid.length == 46;
}

export function capitalize(str: string): string {

    return str.split(" ")
        .map(word => word[0].toUpperCase() + word.slice(1, str.length))
        .join(" ");
}

export function requestsPerMinutesToMinTime(perMinutes: number): number {
    const perSeconds = perMinutes / 60;
    return 1 / perSeconds * 1000;
}

export function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/** Function that count occurrences of a substring in a string;
 * @param {String} string               The string
 * @param {String} subString            The sub string to search for
 * @param {Boolean} [allowOverlapping]  Optional. (Default:false)
 *
 * @author Vitim.us https://gist.github.com/victornpb/7736865
 * @see Unit Test https://jsfiddle.net/Victornpb/5axuh96u/
 * @see https://stackoverflow.com/a/7924240/938822
 */
export function getOccurences(string: string, subString: string, allowOverlapping: boolean = false) {

    string += "";
    subString += "";
    if (subString.length <= 0) return (string.length + 1);

    let n = 0;
    let pos = 0;
    const step = allowOverlapping ? 1 : subString.length;

    // eslint-disable-next-line no-constant-condition
    while (true) {
        pos = string.indexOf(subString, pos);
        if (pos >= 0) {
            ++n;
            pos += step;
        } else break;
    }
    return n;
}

export function toPaths(cidBySlot: { [key: string]: string }, ipfsCache: ImagesDownloader, renderConfig: RenderConfig): string[] {
    const paths: [string, string][] = [];

    for (const slot in cidBySlot) {
        const cid = cidBySlot[slot];
        const path = ipfsCache.toPath(cid);
        paths.push([slot, path]);
    }

    return sortImages(paths, renderConfig.layersOrder)
        .map(kvp => kvp[1]);
}

export function toCidBySlot(renderAttributes: RenderAttributes, renderConfig: RenderConfig): { [key: string]: string } {
    const output: { [key: string]: string } = {};

    renderAttributes.getIdsBySlot().forEach(([slot, itemId]) => {
        const cid = renderConfig.getCid(slot, itemId);
        output[slot] = cid;
    });

    return output;
}

export function addDefaultImages(cidBySlot: { [key: string]: string }, renderConfig: RenderConfig) {
    if (renderConfig.defaultLayers) {
        for (const slot in renderConfig.defaultLayers) {
            if (cidBySlot[slot] == null) {
                cidBySlot[slot] = renderConfig.defaultLayers[slot];
            }
        }
    }

    return cidBySlot;
}