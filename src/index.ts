import express from 'express';
import 'dotenv/config'
import helmet from 'helmet';
import cors from "cors";
import getPenguins from './routes/penguins/owned';
import getItems from './routes/items/owned';
import { api, gateway } from './const';
import { getNetworkType } from './env';
import throng from 'throng';
import { APCNetworkProvider } from './classes/APCNetworkProvider';
import { ProxyNetworkProvider } from '@elrondnetwork/erdjs-network-providers/out';
import getAttributes from './routes/attributes/attributes';
import getPenguin from './routes/penguins/penguin';
import getItem from './routes/items/item';
import getOffers from './routes/generic/offers';
import getActivity from './routes/generic/activity';

const workers = parseInt(process.env.WEB_CONCURRENCY || "1");
const port = process.env.PORT || 5001;

throng(workers, start);

function start(id: number) {
    const app = express();

    app.use(helmet({
        crossOriginEmbedderPolicy: false,
    }));
    app.use(cors());

    const proxyNetwork = new APCNetworkProvider(gateway, api);


    app.get('/penguins/penguin/:id', (req, res) => getPenguin(req, res, proxyNetwork));
    app.get("/penguins/activity/:id", (req, res) => getActivity(req, res, "penguins"));
    app.get("/penguins/offers", (req, res) => getOffers(req, res, "penguins"));
    app.get('/penguins/owned/:bech32', (req, res) => getPenguins(req, res, proxyNetwork));

    app.get("/items/penguin/:id", (req, res) => getItem(req, res, proxyNetwork));
    app.get("/items/activity/:id", (req, res) => getActivity(req, res, "items"));
    app.get("/items/offers/:category", (req, res) => getOffers(req, res, "items"));
    app.get('/items/owned/:bech32', (req, res) => getItems(req, res, proxyNetwork));

    app.get('/attributes', (req, res) => getAttributes(req, res, proxyNetwork));


    app.listen(port, () => {
        console.log(`Thread #${id} listening on port ${port}.`);
        console.log(`   network: ${getNetworkType()}`)
        console.log(`   gateway: ${gateway}`)
    });

    ProxyNetworkProvider
}
