import fs from 'fs';
import axios from "axios";

/**
 * Download image and write to filepath. Returns also the buffer
 */
export async function downloadImage(url: string, filepath: string): Promise<Buffer> {

    const response = await axios.get(url,
        {
            responseType: 'arraybuffer',
            timeout: 10000
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

            if (a_index == -1) throw new Error("Unknown slot " + a[0]);
            if (b_index == -1) throw new Error("Unknown slot " + b[0]);

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