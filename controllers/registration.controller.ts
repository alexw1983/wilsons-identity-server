import express, { Router } from 'express';
import { registerUser } from '../modules/database/users';
import { Logger } from '../middleware';

export class RegistrationController {
    public router = Router();

    constructor(private logger: Logger) {
        this.intializeRoutes();
    }

    public intializeRoutes() {
        this.router.get('/register', (req: express.Request, res: express.Response) => {
            res.render('register', { title: 'Register', errors: [] });
        })

        this.router.get("/register-success", (req: express.Request, res: express.Response) => {
            res.render('register-success', { title: 'Success', errors: [] });
        })

        this.router.post('/register', async (req: express.Request, res: express.Response) => {
            const newUser = {
                email: req.body.email,
                password: req.body.password
            }

            if (!newUser.email || !newUser.password) {
                return res.render('register', { title: 'Register', errors: ["Must enter all fields"] });
            }

            try {
                await registerUser(newUser)
                return res.redirect("/register-success");

            } catch (error) {
                this.logger.Error(error);
                return res.render('register', { title: 'Register', errors: [error] });
            }
        })
    }
}