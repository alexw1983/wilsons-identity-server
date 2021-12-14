import express, { Router } from 'express';
import { getAll, updateUser } from '../modules';
import { Logger } from '../middleware';

export class UsersController {
    public router = Router();

    constructor(private logger: Logger) {
        this.intializeRoutes();
    }

    public intializeRoutes() {
        this.router.get('/users', async (req: express.Request, res: express.Response) => {
            const users = await getAll();
            res.send(users.map(u => ({ ...u, password: undefined })));
        })

        this.router.put('/users', async (req: express.Request, res: express.Response) => {
            try {
                await updateUser(req.body);

                return res.send({ message: "Update Succesful" });
            } catch (error) {
                return res.status(500).send({ error: error });
            }
        })
    }
}