import "dotenv/config"

export const mainnetGateway: string = process.env.MAINNET_GATEWAY ?? "";

if (!mainnetGateway) {
    throw new Error("MAINNET_GATEWAY is not set");
}