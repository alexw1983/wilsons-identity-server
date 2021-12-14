import { App } from './app';
import { config } from './config';
import { RegistrationController, UsersController, TokensController } from './controllers'
import { Logger } from './middleware';

const logger = new Logger()

const app = new App(
    [
        new RegistrationController(logger),
        new UsersController(logger),
        new TokensController()
    ],
    config.PORT,
    logger
);

app.listen();