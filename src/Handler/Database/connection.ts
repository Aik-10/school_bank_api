import { sleep } from '../../Utils/sleep';
import { createPool, Pool, PoolConnection, RowDataPacket } from 'mysql2/promise';

export let pool: Pool;
export let isServerConnected = false;
export let dbVersion = '';

export async function waitForConnection() {
    while (!isServerConnected) {
        await sleep(0);
    }
}

const activeConnections: Record<string, PoolConnection> = {};

export async function createConnectionPool() {
    try {
        pool = createPool(process.env.MYSQL_POOL_CONNECTION);

        pool.on('acquire', (conn) => {
            const connectionId: number = (conn as any).connectionId;
            activeConnections[connectionId] = conn;
        });

        pool.on('release', (conn) => {
            const connectionId: number = (conn as any).connectionId;
            delete activeConnections[connectionId];
        });

        const connection = await pool.getConnection();
        const [result] = await (<Promise<RowDataPacket[]>>connection.query('SELECT VERSION() as version'));
        if (result) {
            dbVersion = `[${result[0].version}]`;
        }

        connection.release();
        console.log(`${dbVersion} Database server connection established!`);

        isServerConnected = true;
    } catch (err: any) {
        isServerConnected = false;

        console.log(
            `Unable to establish a connection to the database (${err.code})!\nError ${err.errno}: ${err.message}`
        );
    }
}

export async function getPoolConnection(id?: number) {
    if (!isServerConnected) await waitForConnection();

    return id ? activeConnections[id] : pool.getConnection();
}