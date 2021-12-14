import { App } from './app';
import { config } from './config';
import { UsersController } from './controllers'
import { Logger } from './middleware';

const logger = new Logger()

const app = new App(
    [
        new UsersController(logger),
    ],
    config.PORT,
    logger
);

app.listen();