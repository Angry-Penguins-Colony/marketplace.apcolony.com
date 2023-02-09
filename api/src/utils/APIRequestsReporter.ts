import fs from "fs";
import os from "os";
import { APCNetworkProvider } from "../classes/APCNetworkProvider";

/**
 * Write APCNetworkProvider analytics to a file.
 */
export class APIRequestsReporter {

    private startTimestamp?: number;

    constructor(
        private readonly timeInterval: number,
        private readonly networkProvider: APCNetworkProvider,
        private readonly logFile: string = "api-requests.csv"
    ) {

    }

    public start() {
        this.startTimestamp = Date.now();
        fs.writeFile(this.logFile, "Time Alive (secs),API requests,Gateway Requests" + os.EOL, () => { }); // fire-and-forget

        setInterval(this.appendFile.bind(this), this.timeInterval);
    }

    private appendFile() {

        if (this.startTimestamp == undefined) throw new Error("start() was not called");

        const elapsedTimeInSecs = (Date.now() - this.startTimestamp) / 1000;
        const timeRounded = Math.round(elapsedTimeInSecs * 100) / 100;

        const { api, gateway } = this.networkProvider.lastMinuteRequests;

        const line = [
            timeRounded,
            api.averageRequestPerSeconds.toFixed(2),
            gateway.averageRequestPerSeconds.toFixed(2)
        ].join(",")

        fs.appendFile(this.logFile, line + os.EOL, () => { }); // fire-and-forget        
    }
}