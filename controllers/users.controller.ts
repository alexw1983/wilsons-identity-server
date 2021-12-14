import express, { Router } from 'express';
import { getAll } from '../database/users';
import { Logger } from '../middleware';

export class UsersController {
    public router = Router();

    constructor(private logger: Logger) {
        this.intializeRoutes();
    }

    public intializeRoutes() {
        this.router.get('/users', async (req: express.Request, res: express.Response) => {
            const users = await getAll();
            res.render('users', { title: 'Users', users: users, errors: [] });
        })
    }
}