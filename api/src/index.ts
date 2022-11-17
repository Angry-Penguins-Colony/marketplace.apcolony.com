import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import throng from "throng";
import { APCNetworkProvider } from "./classes/APCNetworkProvider";
import { gateway, api, itemsDatabase, eggsDatabase, penguinsCollection } from "./const";
import { getNetworkType } from "./env";
import { getOffersOfAccount } from "./routes/accounts/offers";
import { getInventoryOfAccount, getItemsOfAccount, getPenguinsOfAccount } from "./routes/accounts/owned";
import getActivity from "./routes/activities/activity";
import getItem from "./routes/items/item";
import getAttributes from "./routes/misc/attributes";
import getExploreItems from "./routes/misc/exploreItems";
import getItemsList from "./routes/misc/getItems";
import getItemsOffers from "./routes/offers/items/offers";
import getItemOffersStats from "./routes/offers/items/offersStats";
import getOffer from "./routes/offers/offer";
import getPenguinsOffers from "./routes/offers/penguins/offers";
import getPenguinsOffersStats from "./routes/offers/penguins/offersStats";
import getPenguin from "./routes/penguins/penguin";
import getStakingClaimable from "./routes/staking/claim";
import getGeneratedTokens from "./routes/staking/generated";
import getPenguinsStaked from "./routes/staking/owned";
import { logErrorIfMissingItems } from "./utils/dbHelper";


const workers = parseInt(process.env.WEB_CONCURRENCY || "1");
const port = process.env.PORT || 5001;

throng({
    workers,
    start,
    master
});

function start(id: number) {
    const app = express();

    app.use(helmet({
        crossOriginEmbedderPolicy: false,
        contentSecurityPolicy: false,

    }));
    app.use(cors());

    const limiter = rateLimit({
        windowMs: 60000, // 1 minute
        max: 120,
        standardHeaders: true,
        legacyHeaders: false,
    })

    app.use(limiter);

    const networkProvider = new APCNetworkProvider(gateway, api, itemsDatabase, eggsDatabase);

    networkProvider.cacheCollection(penguinsCollection)
        .then(() => console.log("Penguins collection cached"))
        .catch((e) => console.log("Penguins collection cache failed", e));


    app.get("/accounts/:bech32/owned", async (req: any, res: any) => getInventoryOfAccount(req, res, networkProvider, itemsDatabase));
    app.get("/accounts/:bech32/offers", async (req: any, res: any) => getOffersOfAccount(req, res, networkProvider));
    app.get('/accounts/:bech32/owned/penguins', (req: any, res: any) => getPenguinsOfAccount(req, res, networkProvider));
    app.get('/accounts/:bech32/owned/items', (req: any, res: any) => getItemsOfAccount(req, res, networkProvider));

    app.get('/penguins/penguin/:id', (req: any, res: any) => getPenguin(req, res, networkProvider));
    app.get("/items/item/:id", (req: any, res: any) => getItem(req, res, itemsDatabase, networkProvider));

    app.get("/activities/penguins/:id", (req: any, res: any) => getActivity(req, res, "penguins", networkProvider));
    app.get("/activities/items/:id", (req: any, res: any) => getActivity(req, res, "items", networkProvider));

    app.get("/offers/penguins", (req: any, res: any) => getPenguinsOffers(req, res, networkProvider));
    app.get("/offers/penguins/stats", (req: any, res: any) => getPenguinsOffersStats(req, res, networkProvider));
    app.get("/offers/penguins/offer/:id", (req: any, res: any) => getOffer(req, res, "penguins", networkProvider));

    app.get("/offers/items/", (req: any, res: any) => getItemsOffers(req, res, networkProvider, itemsDatabase));
    app.get("/offers/items/:category", (req: any, res: any) => getItemsOffers(req, res, networkProvider, itemsDatabase));
    app.get("/offers/items/:category/stats", (req: any, res: any) => getItemOffersStats(req, res, networkProvider));
    app.get("/offers/items/offer/:id", (req: any, res: any) => getOffer(req, res, "items", networkProvider));

    app.get('/staking/owned/:bech32', (req: any, res: any) => getPenguinsStaked(req, res, networkProvider));
    app.get('/staking/claimable/:bech32', (req: any, res: any) => getStakingClaimable(req, res, networkProvider));
    app.get('/staking/tokensGenerated/', (req: any, res: any) => getGeneratedTokens(req, res, networkProvider));


    app.get('/attributes/:penguinId', (req: any, res: any) => getAttributes(req, res, networkProvider));
    app.get("/exploreItems", (req: any, res: any) => getExploreItems(req, res, networkProvider, itemsDatabase));
    app.get("/itemsList", (req: any, res: any) => getItemsList(req, res, networkProvider));


    app.listen(port, () => {
        console.log(`Thread #${id} listening on port ${port}.`);
        console.log(`   network: ${getNetworkType()}`)
        console.log(`   gateway: ${gateway}`)
        console.log(`   api: ${api}`)
    });

    if (process.env.SHOW_STATS == "true") {
        setInterval(() => logRequestsInfo(networkProvider), 1_000);
    }
}

async function master() {
    const networkProvider = new APCNetworkProvider(gateway, api, itemsDatabase, eggsDatabase);
    logErrorIfMissingItems(networkProvider);
}

function logRequestsInfo(networkProvider: APCNetworkProvider) {

    const { api, gateway } = networkProvider.lastMinuteRequests;

    const message = `api [${api.averageRequestPerSeconds.toFixed(2)} req/s; ${api.lastMinuteRequests} reqs]`
        + `- gateway [${gateway.averageRequestPerSeconds.toFixed(2)} req/s; ${gateway.lastMinuteRequests} reqs]`;

    rewriteLine(message);
}

function rewriteLine(msg: string) {
    process.stdout.write(msg + "\r");
}
