import { Firestore } from "@google-cloud/firestore";
import { config } from "../../config";
import jwt from "jsonwebtoken";
import fs from 'fs';
import bcrypt from 'bcrypt';
import { User } from "../database";
import { JwtData } from "./tokens";

const db = new Firestore({
    projectId: config.PROJECT_ID,
    keyFilename: config.KEY_FILE_PATH,
});

let privateKey: jwt.Secret;
fs.readFile(config.PRIVATE_KEY_PATH, 'utf8', function (error, data) {
    if (error) {
        console.log(`An error has occurred when reading the key file: ${error}`);
    } else {
        privateKey = data;
    }
});

export const handleROPCTokenRequest = async (req: any, res: any) => {

    try {
        if (req.body.username === undefined ||
            req.body.password === undefined ||
            req.body.client_id === undefined ||
            req.body.client_secret === undefined) {
            return res.status(400).json(JSON.stringify({
                'error': 'invalid_request',
                'error_description': 'Required parameters are missing in the request.'
            }));
        }

        const clientQuery = await db.collection("Clients")
            .where('client_id', '==', req.body.client_id)
            .where('client_secret', '==', req.body.client_secret)
            .where('ropc_enabled', '==', true)
            .get();

        if (clientQuery.empty) {
            return res.status(400).json('Invalid client credentials.');
        }

        const userQuery = await db.collection("Users")
            .where('email', '==', req.body.username)
            .get();

        if (userQuery.empty) {
            return res.status(400).json('Invalid user credentials.');
        }

        let submittedPass = req.body.password;
        let storedPass = userQuery.docs[0].data().password;

        const passwordMatch = await bcrypt.compare(submittedPass, storedPass);
        if (!passwordMatch) {
            return res.status(400).json('Invalid password.');
        }



        const jwtData: JwtData = { roles: [], email: undefined, name: undefined };
        const scopes = req.body.scopes as string[];
        const user = userQuery.docs[0].data() as User;

        if (!!scopes && !!user) {
            if (scopes.includes("roles")) {
                jwtData.roles = user.roles;
            }

            if (scopes.includes("profile")) {
                jwtData.name = `${user.username}`;
                jwtData.email = user.email;
            }
        }

        const token = jwt.sign(jwtData, privateKey, {
            algorithm: 'RS256',
            expiresIn: config.JWT_LIFE_SPAN,
            issuer: config.ISSUER
        });

        return res.status(200).json({
            access_token: token,
            token_type: 'JWT',
            expires_in: config.JWT_LIFE_SPAN
        });
    } catch (error) {
        return res.status(500).json(error);
    }
}