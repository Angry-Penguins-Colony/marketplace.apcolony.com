import { UserSigner } from "@elrondnetwork/erdjs-walletcore/out";
import { ISigner } from "@elrondnetwork/erdjs-walletcore/out/interface";
import { Address, IAddress } from "@elrondnetwork/erdjs/out";
import "dotenv/config";

export function requestsPerMinutesToMinTime(perMinutes: number): number {
    const perSeconds = perMinutes / 60;
    return 1 / perSeconds * 1000;
}

export function getRandomIn<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
}

export const envVariables = {
    signer: UserSigner.fromPem(getFromEnv("SENDER_PEM")),
    senderAddress: Address.fromString(getFromEnv("SENDER_BECH32")),
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

    var n = 0,
        pos = 0,
        step = allowOverlapping ? 1 : subString.length;

    while (true) {
        pos = string.indexOf(subString, pos);
        if (pos >= 0) {
            ++n;
            pos += step;
        } else break;
    }
    return n;
}

Object.freeze(envVariables)

function getFromEnv(varName: string): string {
    const value = process.env[varName];
    if (!value) {
        throw new Error(`Missing ${varName} environment variable.`);
    }
    return value;
}