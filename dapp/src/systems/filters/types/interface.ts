export interface IFilter<T> {
    badgePillLabel: string[];
    applyFilter: (items: T[]) => T[];
}