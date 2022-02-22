import path from 'path';
import dotenv from 'dotenv';
import { Knex } from 'knex';

dotenv.config();

export const development: Knex.Config = {
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        user: process.env.DEV_DB_USER,
        password: process.env.DEV_DB_PASS,
        database: 'bitcoinwallet'
    },
    migrations: {
        directory: path.join(__dirname, '/db/migrations')
    },
    seeds: {
        directory: path.join(__dirname, '/db/seeds')
    }
};

export const test: Knex.Config = {
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        user: process.env.TEST_DB_USER,
        password: process.env.TEST_DB_PASS,
        database: 'bitcoinwallet'
    },
    migrations: {
        directory: path.join(__dirname, '/db/migrations')
    },
    seeds: {
        directory: path.join(__dirname, '/db/seeds')
    }
};

export const production: Knex.Config = {
    client: 'pg',
    connection: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        port: 5432,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        ssl: { rejectUnauthorized: false }
    },
    // connection: process.env.PRODUCTION_DB,
    migrations: {
        directory: path.join(__dirname, '/db/migrations')
    },
    seeds: {
        directory: path.join(__dirname, '/db/seeds')
    }
};
