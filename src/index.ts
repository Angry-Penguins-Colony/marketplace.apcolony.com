import express from 'express';
import 'dotenv/config'
import helmet from 'helmet';
import cors from "cors";
import getPenguins from './routes/address/penguins';
import getEggs from './routes/address/eggs';
import getItems from './routes/address/items';
import { mainnetGateway } from './env';
import { getPlaceholdersEggs, getPlaceholdersItems, getPlaceholdersPenguins } from './routes/placeholders/placeholder';

const port = process.env.PORT || 5001;

const app = express();

app.use(helmet({
    crossOriginEmbedderPolicy: false,
}));
app.use(cors());

app.get('/:bech32/penguins', (req, res) => getPenguins(req, res, mainnetGateway));
app.get('/placeholder/:bech32/penguins', (req, res) => getPlaceholdersPenguins(res));

app.get('/:bech32/eggs', getEggs);
app.get('/placeholder/:bech32/eggs', (req, res) => getPlaceholdersEggs(res));

app.get('/:bech32/items', getItems);
app.get('/placeholder/:bech32/items', (req, res) => getPlaceholdersItems(res));

app.listen(port, () => console.log(`Server listening on port ${port}!`));