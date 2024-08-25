const pgp = require("pg-promise")();
require("dotenv").config()

const databaseUrl = process.env.DATABASE_URL || 'postgres://wztmixlm:bbbIh0YBcx3rU9jvX8dB0t8lG0HVUf8D@peanut.db.elephantsql.com/wztmixlm';

const cn = {
    connectionString: databaseUrl,
    allowExitOnIdle: true,
    max:30
}
// if(process.env.NODE_ENV === 'production'){
//     cn.ssl = { rejectUnauthorized: false}
// }

const db = pgp(cn);
module.exports = db;