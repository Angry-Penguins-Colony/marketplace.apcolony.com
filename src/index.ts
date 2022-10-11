import express from 'express';
import 'dotenv/config'
import helmet from 'helmet';
import cors from "cors";
import getPenguins from './routes/penguins/owned';
import getOwnedItems from './routes/items/owned';
import { api, gateway } from './const';
import { getNetworkType } from './env';
import throng from 'throng';
import { APCNetworkProvider } from './classes/APCNetworkProvider';
import { ProxyNetworkProvider } from '@elrondnetwork/erdjs-network-providers/out';
import getAttributes from './routes/attributes/attributes';
import getPenguin from './routes/penguins/penguin';
import getItem from './routes/items/item';
import getItemsOffers from './routes/items/offers';
import getActivity from './routes/generic/activity';
import getPenguinsOffers from './routes/penguins/offers';
import getOffer from './routes/generic/offer';
import getItemOffersStats from './routes/items/offersStats';
import getPenguinsOffersStats from './routes/penguins/offersStats';
import getExploreItems from './routes/root/exploreItems';
import getOwnedAmount from './routes/root/ownedAmount';
import { logErrorIfMissingItems } from './utils/dbHelper';

const workers = parseInt(process.env.WEB_CONCURRENCY || "1");
const port = process.env.PORT || 5001;

throng(workers, start);

function start(id: number) {
    const app = express();

    app.use(helmet({
        crossOriginEmbedderPolicy: false,
    }));
    app.use(cors());

    const networkProvider = new APCNetworkProvider(gateway, api);

    logErrorIfMissingItems(networkProvider);

    app.get("/owned/:bech32", async (req, res) => getOwnedAmount(req, res, networkProvider));
    app.get('/penguins/penguin/:id', (req, res) => getPenguin(req, res, networkProvider));
    app.get("/penguins/activity/:id", (req, res) => getActivity(req, res, "penguins", networkProvider));
    app.get("/penguins/offers", (req, res) => getPenguinsOffers(req, res, networkProvider));
    app.get("/penguins/offers/stats", (req, res) => getPenguinsOffersStats(req, res, networkProvider));
    app.get("/penguins/offer/:id", (req, res) => getOffer(req, res, "penguins", networkProvider));
    app.get('/penguins/owned/:bech32', (req, res) => getPenguins(req, res, networkProvider));

    app.get("/items/item/:id", (req, res) => getItem(req, res, networkProvider));
    app.get("/items/activity/:id", (req, res) => getActivity(req, res, "items", networkProvider));
    app.get("/items/offers/", (req, res) => getItemsOffers(req, res, networkProvider));
    app.get("/items/offers/:category", (req, res) => getItemsOffers(req, res, networkProvider));
    app.get("/items/offers/:category/stats", (req, res) => getItemOffersStats(req, res, networkProvider));
    app.get("/items/offer/:id", (req, res) => getOffer(req, res, "items", networkProvider));
    app.get('/items/owned/:bech32', (req, res) => getOwnedItems(req, res, networkProvider));

    app.get('/attributes', (req, res) => getAttributes(req, res, networkProvider));
    app.get("/exploreItems", (req, res) => getExploreItems(req, res, networkProvider));


    app.listen(port, () => {
        console.log(`Thread #${id} listening on port ${port}.`);
        console.log(`   network: ${getNetworkType()}`)
        console.log(`   gateway: ${gateway}`)
    });

    ProxyNetworkProvider
}
