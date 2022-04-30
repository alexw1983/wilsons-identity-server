import { Firestore } from "@google-cloud/firestore";
import { config } from '../../config';

const db = new Firestore({
    projectId: config.PROJECT_ID,
    keyFilename: config.KEY_FILE_PATH,
});

export const seedClients = async (): Promise<void> => {

    const clients = [
        {
            name: 'postman',
            client_id: 'BnI01NGAIXObffJllNJB',
            client_secret: 'd3d9bff1-e834-4291-af6a-e9bec9fed1f3',
            ropc_enabled: true
        }
    ]

    const ref = db.collection('Clients');

    clients.forEach(async client => {
        await ref.doc(client.name).set(client);
    })
}

const listClients = async (): Promise<void> => {
    const ref = db.collection('Clients');
    const actual = await ref.get();

    actual.forEach(doc => {
        console.log(doc.data());
    })
}

seedClients();

listClients();