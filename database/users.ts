import { config } from '../config';
import { Firestore } from "@google-cloud/firestore";
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from "uuid";

export type Roles = "Admin" | "EstablishmentOwner" | "Customer";

export interface User {
    id: string;
    email: string;
    password: string;
    username: string;
    roles: Roles[];
}

export interface RegistrationRequest {
    email: string;
    password: string;
}

const db = new Firestore({
    projectId: config.PROJECT_ID,
    keyFilename: config.KEY_FILE_PATH,
});


export const getAll = async (): Promise<User[]> => {
    const ref = db.collection('Users');
    return (await ref.get()).docs.map(d => d.data() as User);
}

export const registerUser = async (user: RegistrationRequest): Promise<void> => {

    if (!user.email || !user.password) {
        throw 'Invalid User';
    }

    const ref = db.collection('Users');
    const existing = await ref
        .where('email', '==', user.email)
        .get();

    if (!existing.empty) {
        throw 'User Already exists';
    }

    const hashPassword = await bcrypt.hash(user.password, 10);

    let newUser = {
        ...user,
        id: uuidv4(),
        password: hashPassword,
    };

    await ref.doc(user.email).set(newUser);
}


export const updateUser = async (user: User): Promise<void> => {

    if (!user.email || !user.password) {
        throw 'Invalid User';
    }

    const ref = db.collection('Users');
    const existing = await ref
        .where('email', '==', user.email)
        .get();

    const hashPassword = await bcrypt.hash(user.password, 10);

    let newUser = existing.empty ? {
        ...user,
        password: hashPassword,
    } : {
        ...existing.docs[0].data(),
        ...user,
        password: hashPassword,
    };

    console.log("got here", newUser)

    await ref.doc(user.email).set(newUser);
}
