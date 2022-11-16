export type LogType = 'api';

export default class APCLogger {

    constructor(public readonly hideLogs: LogType[] = []) {

    }

    public apiCall(url: string, durationMs: number) {

        if (this.hideLogs.includes('api')) return;

        console.log(`%c[API] (${durationMs}ms) ${url} `, 'color: grey');
    }
}