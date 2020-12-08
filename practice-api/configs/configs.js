require('dotenv').config();

const {
    DB_API,
    DB_USER,
    DB_PASS
} = process.env;

module.exports = {
    DB_CONNECT_STR: `mongodb+srv://${DB_USER}:${DB_PASS}@demo-cluster.xhssr.mongodb.net/${DB_API}?retryWrites=true&w=majority`,
}