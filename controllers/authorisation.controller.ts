import express, { Router } from 'express';
import { handleACPKCESigninRequest, handleACSigninRequest } from '../modules';

export class AuthorisationController {
    public router = Router();

    constructor() {
        this.intializeRoutes();
    }

    public intializeRoutes() {
        this.router.post("/auth", async (req: express.Request, res: express.Response) => {
            switch (req.body.grant_type) {
                case "code":
                    if (req.body.code_challenge) {
                        await handleACPKCESigninRequest(req, res);
                    }
                    else {
                        await handleACSigninRequest(req, res);
                    }

                    break;
                default:
                    res.status(500).json("Invalid grant type");
                    break;
            }
        });
    }
}