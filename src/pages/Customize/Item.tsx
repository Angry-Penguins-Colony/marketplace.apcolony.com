export interface Item {
    identifier: string;
    slot: string;
    name: string;
    thumbnailCID: string;
    renderCID: string;
    amount: number;

    isSelected?: boolean;
}