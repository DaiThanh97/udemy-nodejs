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
    DB_CONNECT_STR: `mongodb+srv://${DB_USER}:${DB_PASS}@demo-cluster.xhssr.mongodb.net/${DB_TEST}?retryWrites=true&w=majority`,
    MULTER_DISK_STORAGE: fileStorage,
    MULTER_FILE_FILTER: fileFilter,
}