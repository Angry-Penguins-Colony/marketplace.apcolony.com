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
    pinataApiKey: getFromEnv("PINATA_API_KEY"),
    pinataApiSecret: getFromEnv("PINATA_API_SECRET"),
    awsAccessKeyId: getFromEnv("AWS_ACCESS_KEY_ID"),
    awsSecretAccessKey: getFromEnv("AWS_SECRET_ACCESS_KEY"),
}


Object.freeze(envVariables)

function getFromEnv(varName: string): string {
    const value = process.env[varName];
    if (!value) {
        throw new Error(`Missing ${varName} environment variable.`);
    }
    return value;
}