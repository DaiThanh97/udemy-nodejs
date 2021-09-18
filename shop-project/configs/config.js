require('dotenv').config();
const multer = require('multer');

const {
    DB_USER,
    DB_PASS,
    DB_TEST,
    PATH_UPLOAD_IMG
} = process.env;

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, PATH_UPLOAD_IMG);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
})
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
        cb(null, true);
    }
    else {
        cb(null, false);
    }
}

module.exports = {
    DB_CONNECT_STR: `mongodb://tio-user:lpJmU1XG4YfvW6TD@demo-cluster-shard-00-00.xhssr.mongodb.net:27017,demo-cluster-shard-00-01.xhssr.mongodb.net:27017,demo-cluster-shard-00-02.xhssr.mongodb.net:27017/${DB_TEST}?ssl=true&replicaSet=atlas-dk59dk-shard-0&authSource=admin&retryWrites=true&w=majority`,
    MULTER_DISK_STORAGE: fileStorage,
    MULTER_FILE_FILTER: fileFilter,
}