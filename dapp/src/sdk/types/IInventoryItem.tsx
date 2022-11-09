export interface IInventoryItem {
    thumbnailUrls: {
        high: string;
    };
    displayName: string;
    score?: number;
    purchaseDate?: Date;
    id: string;
}
