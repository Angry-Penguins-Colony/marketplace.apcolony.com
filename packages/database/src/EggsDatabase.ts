import { EggTier, IEgg } from "@apcolony/marketplace-api";


export class EggsDatabase {
    private readonly eggs: IEgg[] = [];

    constructor(collection: string) {

        const diamondEgg: IEgg = {
            tier: "diamond",
            id: "diamond",
            displayName: "Diamond Egg",
            thumbnailUrls: {
                ipfs: "https://ipfs.io/ipfs/Qmf3PVzoxPXXiHon12XNKYRwbKPFHnZGQPNxZNGU17SaWt",
                high: "https://apc-eggs.s3.eu-west-3.amazonaws.com/eggs/diamond.png",
                small: "https://apc-eggs.s3.eu-west-3.amazonaws.com/eggs/diamond.png",
            },
            collection: collection,
            identifier: collection + "-01",
            nonce: 1,
            type: "eggs",
            supply: 615
        };

        const goldEgg: IEgg = {
            tier: "gold",
            id: "gold",
            displayName: "Gold Egg",
            thumbnailUrls: {
                ipfs: "https://ipfs.io/ipfs/QmYmsCjRY72nEC1kxVA2rhcUSYSo8iQWE6JkpP5QgeNEX9",
                high: "https://apc-eggs.s3.eu-west-3.amazonaws.com/eggs/gold.png",
                small: "https://apc-eggs.s3.eu-west-3.amazonaws.com/eggs/gold.png",
            },
            collection: collection,
            identifier: collection + "-02",
            nonce: 2,
            type: "eggs",
            supply: 2085
        }

        const silverEgg: IEgg = {
            tier: "silver",
            displayName: "Silver Egg",
            id: "silver",
            thumbnailUrls: {
                ipfs: "https://ipfs.io/ipfs/QmQTXxFA1xYCe3QHrAtnmCjaV1ELjhozNtSKAVUGvmrLBR",
                high: "https://apc-eggs.s3.eu-west-3.amazonaws.com/eggs/silver.png",
                small: "https://apc-eggs.s3.eu-west-3.amazonaws.com/eggs/silver.png",
            },
            collection: collection,
            identifier: collection + "-03",
            nonce: 3,
            type: "eggs",
            supply: 7300
        }

        this.eggs = [
            silverEgg,
            goldEgg,
            diamondEgg
        ];
    }

    public getEggFromNonce(nonce: number): IEgg {
        const egg = this.eggs.find(egg => egg.nonce == nonce);

        if (!egg) {
            throw new Error("Egg not found");
        }

        return egg;
    }


    public getEggFromTier(tier: EggTier): IEgg {

        const egg = this.eggs.find(egg => egg.tier == tier);

        if (!egg) {
            throw new Error(`Can't find correspoding egg for tier ${tier}`);
        }

        return egg;
    }

    public isTierValid(tier: string): boolean {
        return this.eggs.some(egg => egg.tier == tier);
    }
}