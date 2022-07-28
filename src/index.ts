import express from 'express';
import 'dotenv/config'
import helmet from 'helmet';
import cors from "cors";
import getPenguins from './routes/address/penguin';

const port = process.env.PORT || 3576;

const app = express();

app.use(helmet({
    crossOriginEmbedderPolicy: false,
}));
app.use(cors());

app.get('/:bech32/penguins', getPenguins);
app.listen(port, () => console.log(`Server listening on port ${port}!`));