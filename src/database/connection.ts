import knex from 'knex';

const connection = knex({
    client: process.env.DATABASE_CLIENT,
    connection: process.env.DATABASE_URL,
});

export { connection };
