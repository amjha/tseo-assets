import {createConnection} from 'typeorm';
import {Photo} from './model';

let conn;

export async function connectionHandle() {
    if (conn === undefined) {
        try {
            // @ts-ignore
            conn = await createConnection({
                type: process.env.DB_TYPE,
                host: process.env.DB_SERVER,
                port: process.env.DB_PORT,
                username: process.env.DB_USER,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_NAME,
                entities: [
                    Photo
                ],
                synchronize: true,
                logging: false
            });

        } catch (err) {
            throw  err;
        }
    }
    return conn;
}
