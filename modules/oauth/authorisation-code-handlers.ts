import { Firestore } from '@google-cloud/firestore';
import express from 'express';
import { config } from '../../config';
import bcrypt from 'bcrypt';

const db = new Firestore({
    projectId: config.PROJECT_ID,
    keyFilename: config.KEY_FILE_PATH,
});

export const handleACSigninRequest = async (req: express.Request, res: express.Response) => {

}

export const handleACPKCESigninRequest = async (req: express.Request, res: express.Response) => {
    if (req.body.username === undefined ||
        req.body.password === undefined ||
        req.body.client_id === undefined ||
        req.body.redirect_url === undefined ||
        req.body.code_challenge === undefined) {
        return res.status(400).send(JSON.stringify({
            'error': 'invalid_request',
            'error_description': 'Required parameters are missing in the request.'
        }));
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

    // const userQuery = datastore
    //     .createQuery('user')
    //     .filter('username', '=', req.body.username)
    //     .filter('password', '=', req.body.password);

    // const clientQuery = datastore
    //     .createQuery('client')
    //     .filter('client-id', '=', req.body.client_id)
    //     .filter('redirect-url', '=', req.body.redirect_url)
    //     .filter('acpkce-enabled', '=', true);

    const clientQuery = await db.collection("Clients")
        .where('client_id', '==', req.body.client_id)
        .where('redirect-url', '==', req.body.redirect_url)
        .where('acpkce_enabled', '==', true)
        .get();

    if (clientQuery.empty) {
        return res.status(400).json('Invalid client and/or redirect URL.');
    }


    const authorizationCode = await bcrypt
        .hash(JSON.stringify({
            'client_id': req.body.client_id,
            'redirect_url': req.body.redirect_url
        }), 10)
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');

    const exp = Date.now() + config.CODE_LIFE_SPAN;

    const codeKey = db.key(['authorization_code', authorizationCode]);
    const data = {
        'client_id': req.body.client_id,
        'redirect_url': req.body.redirect_url,
        'exp': exp,
        'code_challenge': req.body.code_challenge
    };

    //return Promise.all([
    db.upsert({ key: codeKey, data: data }),
        Promise.resolve(authorizationCode)
    //]);

    res.redirect(appendQuery(req.body.redirect_url, {
        authorization_code: results[1]
    }));

    //datastore
    // .runQuery(userQuery)
    // .then(result => {
    //     if (result[0].length === 0) {
    //         return Promise.reject(new Error('Invalid user credentials.'));
    //     }
    // })
    // .then(() => {
    //     return datastore.runQuery(clientQuery);
    // })
    // .then(result => {
    //     if (result[0].length === 0) {
    //         return Promise.reject(new Error('Invalid client and/or redirect URL.'));
    //     }
    // })
    // .then(() => {
    // const authorizationCode = await bcrypt
    //     .hash(JSON.stringify({
    //         'client_id': req.body.client_id,
    //         'redirect_url': req.body.redirect_url
    //     }), 10)
    //     .toString('base64')
    //     .replace(/\+/g, '-')
    //     .replace(/\//g, '_')
    //     .replace(/=/g, '');

    // const exp = Date.now() + config.CODE_LIFE_SPAN;

    // const codeKey = db.key(['authorization_code', authorizationCode]);
    // const data = {
    //     'client_id': req.body.client_id,
    //     'redirect_url': req.body.redirect_url,
    //     'exp': exp,
    //     'code_challenge': req.body.code_challenge
    // };

    // return Promise.all([
    //     db.upsert({ key: codeKey, data: data }),
    //     Promise.resolve(authorizationCode)
    // ]);
    //})
    // .then(results => {
    //     res.redirect(appendQuery(req.body.redirect_url, {
    //         authorization_code: results[1]
    //     }));
    // });
}