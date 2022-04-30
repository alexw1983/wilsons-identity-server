import express, { Router } from 'express';
import { handleROPCTokenRequest } from '../modules';

export class TokensController {
    public router = Router();

    constructor() {
        this.intializeRoutes();
    }

    public intializeRoutes() {
        this.router.post("/token", async (req: express.Request, res: express.Response) => {
            switch (req.body.grant_type) {
                case "password":
                    await handleROPCTokenRequest(req, res);
                    break;
                default:
                    res.status(500).json("Invalid grant type");
                    break;
            }
        });
    }
}