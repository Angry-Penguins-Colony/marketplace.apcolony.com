export default interface Filters {
    items: {
        title: string;
        value: string;
        icon: string;
        attributes: {
            name: string;
            number: number;
            value: string;
            isSelected: boolean;
            isTmpSelected: boolean;
        }[];
    }[];
    selected: {
        name: string;
        value: string;
        number: number;
    }[];
};
