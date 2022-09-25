export type LogType = 'api';

export default class APCLogger {

    constructor(public readonly hideLogs: LogType[] = []) {

    }

    public apiCall(url: string) {

        if (this.hideLogs.includes('api')) return;

        console.log(`%c[API] ${url} `, 'color: grey');
    }
}