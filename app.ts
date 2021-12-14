import express from 'express'
import { config } from './config';
import { Logger } from './middleware';

const logger = new Logger;
const app = express();

app.use(express.json());

app.listen(config.PORT, () => {
    logger.Log(`Server listening on port ${config.PORT}`);
})