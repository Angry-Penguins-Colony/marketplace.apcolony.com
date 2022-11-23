import { requestsPerMinutesToMinTime } from "./utils";

export const functionNames = {
    getImagesToRender: "getImagesToRender"
}

export const officialGatewayMaxRPS = 50;
export const minTimeOfficialGateway = requestsPerMinutesToMinTime(officialGatewayMaxRPS);

