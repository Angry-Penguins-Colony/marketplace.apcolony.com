export interface IInventoryItem {
    thumbnailUrls: {
        high: string;
    };
    name: string;
    score?: number;
    purchaseDate?: Date;
    id: string;
}
