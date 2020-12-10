const multer = require('multer');

const {
    DB_POST,
    DB_USER,
    DB_PASS,
    PATH_UPLOAD_IMG
} = process.env;

const MULTER_CONFIG = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, PATH_UPLOAD_IMG);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const MULTER_FILE_FILTER = (req, file, cb) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
        cb(null, true);
    }
    else {
        cb(null, false);
    }
}

module.exports = {
    DB_CONNECT_STR: `mongodb+srv://${DB_USER}:${DB_PASS}@demo-cluster.xhssr.mongodb.net/${DB_POST}?retryWrites=true&w=majority`,
    MULTER_CONFIG,
    MULTER_FILE_FILTER
}