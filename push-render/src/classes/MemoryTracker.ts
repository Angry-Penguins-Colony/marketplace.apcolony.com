import fs from "fs";
import os from "os";

export class MemoryTracker {

    private startTimestamp?: number;
    private static readonly LOG_FILE = "memory-usage.csv";

    constructor(
        private readonly timeInterval: number,
    ) {

    }

    public start() {
        this.startTimestamp = Date.now();
        fs.writeFile(MemoryTracker.LOG_FILE, "Time Alive (secs),Memory MB" + os.EOL, () => { }); // fire-and-forget

        setInterval(this.appendFile.bind(this), this.timeInterval);
    }

    private appendFile() {

        if (this.startTimestamp == undefined) throw new Error("start() was not called");

        const mu = process.memoryUsage();
        // # bytes / KB / MB / GB
        const memoryNow = mu["rss"] / 1024 / 1024;
        const memoryRounded = Math.round(memoryNow * 100) / 100;

        const elapsedTimeInSecs = (Date.now() - this.startTimestamp) / 1000;
        const timeRounded = Math.round(elapsedTimeInSecs * 100) / 100;

        fs.appendFile(MemoryTracker.LOG_FILE, timeRounded + "," + memoryRounded + os.EOL, () => { }); // fire-and-forget        
    }
}