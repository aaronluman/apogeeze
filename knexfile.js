const dotenv = require('dotenv');

if (!process?.env?.DATABASE_URL) {
  dotenv.config({path: './.env'});
}
// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {

  development: {
    client: process.env.DATABASE_CLIENT,
    connection: process.env.DATABASE_URL
  },
};
