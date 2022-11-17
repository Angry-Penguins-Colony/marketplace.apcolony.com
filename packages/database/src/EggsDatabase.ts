import { EggTier, IEgg } from "@apcolony/marketplace-api";


export class EggsDatabase {
    private readonly silverEgg: IEgg;
    private readonly goldEgg: IEgg;
    private readonly diamondEgg: IEgg;

    constructor(collection: string) {
        this.silverEgg = {
            tier: "silver",
            displayName: "Silver Egg",
            thumbnailUrls: {
                ipfs: "https://ipfs.io/ipfs/Qmf3PVzoxPXXiHon12XNKYRwbKPFHnZGQPNxZNGU17SaWt",
                high: "https://apc-eggs.s3.eu-west-3.amazonaws.com/eggs/silver.png",
                small: "https://apc-eggs.s3.eu-west-3.amazonaws.com/eggs/silver.png",
            },
            collection: collection,
            id: "silver",
            identifier: collection + "-01",
            nonce: 1,
            type: "eggs"
        };

        this.goldEgg = {
            tier: "gold",
            displayName: "Gold Egg",
            thumbnailUrls: {
                ipfs: "https://ipfs.io/ipfs/QmYmsCjRY72nEC1kxVA2rhcUSYSo8iQWE6JkpP5QgeNEX9",
                high: "https://apc-eggs.s3.eu-west-3.amazonaws.com/eggs/gold.png",
                small: "https://apc-eggs.s3.eu-west-3.amazonaws.com/eggs/gold.png",
            },
            collection: collection,
            id: "gold",
            identifier: collection + "-02",
            nonce: 2,
            type: "eggs"
        }

        this.diamondEgg = {
            tier: "diamond",
            displayName: "Diamond Egg",
            thumbnailUrls: {
                ipfs: "https://ipfs.io/ipfs/QmQTXxFA1xYCe3QHrAtnmCjaV1ELjhozNtSKAVUGvmrLBR",
                high: "https://apc-eggs.s3.eu-west-3.amazonaws.com/eggs/diamond.png",
                small: "https://apc-eggs.s3.eu-west-3.amazonaws.com/eggs/diamond.png",
            },
            collection: collection,
            id: "diamond",
            identifier: collection + "-03",
            nonce: 3,
            type: "eggs"
        }
    }

    public getEggFromNonce(nonce: number): IEgg {
        return this.getEggFromTier(this.nonceToTier(nonce));
    }

    public nonceToTier(nonce: number): EggTier {
        switch (nonce) {
            case 1:
                return "silver";

            case 2:
                return "gold";

            case 3:
                return "diamond";

            default:
                throw new Error("Invalid nonce");
        }
    }

    public isTierValid(tier: string): boolean {
        switch (tier) {
            case "silver":
            case "gold":
            case "diamond":
                return true;

            default:
                return false;
        }
    }

    public getEggFromTier(tier: EggTier): IEgg {
        switch (tier) {
            case "silver":
                return this.silverEgg;

            case "gold":
                return this.goldEgg;

            case "diamond":
                return this.diamondEgg;

            default:
                throw new Error("Invalid egg tier");
        }
    }
}