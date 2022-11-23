
/**
 * Measure the requests per second.
 * 
 * It helps to reduce the number of requests to the API and the gateway.
 */
export default class RequestsMonitor {
    private _requests: number[] = [];
    private readonly _startTimestamp: number;

    constructor() {
        this._startTimestamp = Date.now();
    }

    /**
     * If we started the requests less than 60 seconds, the averageRequestPerSeconds is wrong
     */
    private get lastMinuteDuration() {

        const deltaMS = Date.now() - this._startTimestamp;
        const delta = deltaMS / 1000;

        return Math.min(delta, 60);
    }

    get lastMinuteRequests() {
        this.trimLastMinute();

        return {
            lastMinuteRequests: this._requests.length,
            averageRequestPerSeconds: this._requests.length / this.lastMinuteDuration
        };
    }

    increment() {
        this._requests.push(Date.now());
    }

    /**
     * Only keep the requests of the last minute.
     */
    private trimLastMinute() {
        const now = Date.now();
        this._requests = this._requests
            .filter(t => t > now - 60000);
    }
}