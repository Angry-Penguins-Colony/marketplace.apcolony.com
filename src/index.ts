import express from 'express';
import 'dotenv/config'
import helmet from 'helmet';
import cors from "cors";
import getPenguins from './routes/address/penguins';
import getEggs from './routes/address/eggs';
import getItems from './routes/address/items';
import { api, gateway } from './const';
import { getNetworkType } from './env';
import throng from 'throng';
import { APCNetworkProvider } from './classes/APCNetworkProvider';
import { ProxyNetworkProvider } from '@elrondnetwork/erdjs-network-providers/out';
import getAttributes from './routes/attributes/attributes';
import getActivity from './routes/activity/activity';
import getPenguin from './routes/penguin/penguin';
import getItem from './routes/item/item';

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

    app.get('/:bech32/penguins', (req, res) => getPenguins(req, res, proxyNetwork));
    app.get('/:bech32/eggs', getEggs);
    app.get('/:bech32/items', (req, res) => getItems(req, res, proxyNetwork));

    app.get("/activity/penguins/:id", (req, res) => getActivity(req, res, "penguins"));
    app.get("/offers/penguins/:id", (req, res) => getActivity(req, res, "penguins"));

    app.get("/activity/items/:id", (req, res) => getActivity(req, res, "items"));
    app.get("/offers/items/:id", (req, res) => getActivity(req, res, "items"));

    app.get('/attributes', (req, res) => getAttributes(req, res, proxyNetwork));
    app.get('/penguins/:id', (req, res) => getPenguin(req, res, proxyNetwork));
    app.get("/items/:id", (req, res) => getItem(req, res, proxyNetwork));


    app.listen(port, () => {
        console.log(`Thread #${id} listening on port ${port}.`);
        console.log(`   network: ${getNetworkType()}`)
        console.log(`   gateway: ${gateway}`)
    });

    ProxyNetworkProvider
}
