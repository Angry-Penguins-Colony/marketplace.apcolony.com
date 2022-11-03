import { FungibleTokenOfAccountOnNetwork } from '@elrondnetwork/erdjs-network-providers/out';
import { Response } from 'express';

export function sendSuccessfulJSON(response: Response, data: any) {
    response
        .setHeader('Access-Control-Allow-Origin', '*')
        .status(200)
        .json({
            code: "successful",
            data: data
        });
}

export async function withTryCatch(response: Response, func: () => Promise<void>) {
    try {
        await func();
    }
    catch (e: any) {
        console.trace(e);
        response.status(500).send(e.toString())
    }

}