import express from 'express';
import 'dotenv/config'
import helmet from 'helmet';
import cors from "cors";
import getPenguins from './routes/address/penguins';
import getEggs from './routes/address/eggs';
import getItems from './routes/address/items';

const port = process.env.PORT || 3576;

const app = express();

app.use(helmet({
    crossOriginEmbedderPolicy: false,
}));
app.use(cors());

app.get('/:bech32/penguins', getPenguins);
app.get('/:bech32/eggs', getEggs);
app.get("/:bech32/items", getItems);
app.listen(port, () => console.log(`Server listening on port ${port}!`));