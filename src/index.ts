import express from 'express';
import 'dotenv/config'
import helmet from 'helmet';
import cors from "cors";
import getPenguins from './routes/address/penguins';
import getEggs from './routes/address/eggs';
import getItems from './routes/address/items';
import { getPlaceholdersEggs, getPlaceholdersItems, getPlaceholdersPenguins } from './routes/placeholders/placeholder';
import { gateway } from './const';
import { getNetworkType } from './env';
import throng from 'throng';
import { APCProxyNetworkProvider } from './classes/APCProxyNetworkProvider';
import { ProxyNetworkProvider } from '@elrondnetwork/erdjs-network-providers/out';
import getAttributes from './routes/attributes/attributes';

const workers = parseInt(process.env.WEB_CONCURRENCY || "1");
const port = process.env.PORT || 5001;

throng(workers, start);

function start(id: number) {
    const app = express();

    app.use(helmet({
        crossOriginEmbedderPolicy: false,
    }));
    app.use(cors());

    const proxyNetwork = new APCProxyNetworkProvider(gateway);

    app.get('/:bech32/penguins', (req, res) => getPenguins(req, res, proxyNetwork));
    app.get('/:bech32/eggs', getEggs);
    app.get('/:bech32/items', (req, res) => getItems(req, res, gateway));
    app.get('/attributes', (req, res) => getAttributes(req, res, proxyNetwork));

    app.get('/placeholder/:bech32/penguins', (req, res) => getPlaceholdersPenguins(res));
    app.get('/placeholder/:bech32/eggs', (req, res) => getPlaceholdersEggs(res));
    app.get('/placeholder/:bech32/items', (req, res) => getPlaceholdersItems(res));

    app.listen(port, () => {
        console.log(`Thread #${id} listening on port ${port}.`);
        console.log(`   network: ${getNetworkType()}`)
        console.log(`   gateway: ${gateway}`)
    });

    ProxyNetworkProvider
}
