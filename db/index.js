const pgp = require("pg-promise")();
require("dotenv").config()

// const databaseUrl = process.env.DATABASE_URL || 'postgres://wztmixlm:bbbIh0YBcx3rU9jvX8dB0t8lG0HVUf8D@peanut.db.elephantsql.com/wztmixlm';
const databaseUrl = process.env.DATABASE_URL || 'postgres://lotteryapi-newbackend2024-main-db-0a9cc6653fa65ad22:mKdFAt6yrt7N3B9h11MRaRXUf8KEbY@user-prod-us-east-2-1.cluster-cfi5vnucvv3w.us-east-2.rds.amazonaws.com:5432/lotteryapi-newbackend2024-main-db-0a9cc6653fa65ad22';


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

