import express, { Application } from 'express';
import { IController } from './controllers';
import { Logger } from './middleware';

export class App {
    public app: Application;
    private logger: Logger;
    public port: number;

    constructor(controllers: IController[], port: number, logger: Logger) {
        this.app = express();
        this.port = port;
        this.logger = logger;

        this.initializeMiddlewares();
        this.initializeControllers(controllers);
    }

    private initializeMiddlewares() {
        this.app.use(express.json());
    }

    private initializeControllers(controllers: IController[]) {
        controllers.forEach((controller) => {
            this.app.use('/', controller.router);
        });
    }

    public listen() {
        this.app.listen(this.port, () => {
            this.logger.Log(`App listening on the port ${this.port}`);
        });
    }
}
