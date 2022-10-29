import "dotenv/config"

export function getNetworkType() {
    switch (process.env.NETWORK_TYPE) {
        case "MAINNET":
            return "MAINNET";

        case "DEVNET":
            return "DEVNET";

        default:
            throw new Error("Invalid network type in .env");
    }
}