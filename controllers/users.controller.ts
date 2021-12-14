import express, { Router } from 'express';
import { Logger } from '../middleware';

export class UsersController {
    public path = '/users';
    public router = Router();

    private logger: Logger;

    constructor(logger: Logger) {
        this.intializeRoutes();
        this.logger = logger;
    }

    public intializeRoutes() {
        this.router.get(this.path, (request: express.Request, response: express.Response) => {
            this.logger.Log("GOT HERE");
            response.send(["hello", "world"])
        });
    }
}