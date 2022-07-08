

export interface IGatewayOptions {
    readGateway?: {
        url: string;
        maxRPS: number;
        maxConcurrent: number;
    };
}
