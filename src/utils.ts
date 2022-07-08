
export function requestsPerMinutesToMinTime(perMinutes: number): number {
    const perSeconds = perMinutes / 60;
    return 1 / perSeconds * 1000;
}
