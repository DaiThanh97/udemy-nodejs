require('dotenv').config();

const { DB_USER, DB_PASS, DB_TEST } = process.env;

module.exports = {
    DB_CONNECT_STR: `mongodb+srv://${DB_USER}:${DB_PASS}@demo-cluster.xhssr.mongodb.net/${DB_TEST}?retryWrites=true&w=majority`,
}