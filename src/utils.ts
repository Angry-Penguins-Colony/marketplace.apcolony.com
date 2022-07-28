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

export function sendSuccessfulArray(response: Response, data: any[]) {
    response
        .setHeader('Access-Control-Allow-Origin', '*')
        .status(200)
        .json({
            code: "successful",
            data: data
        });
}