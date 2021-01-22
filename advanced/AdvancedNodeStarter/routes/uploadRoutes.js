const AWS = require('aws-sdk');
const keys = require('./../config/keys');
const uuid = require('uuid/v1');
const requireLogin = require('./../middlewares/requireLogin');

const s3 = new AWS.S3({
    credentials: {
        accessKeyId: keys.accessKeyId,
        secretAccessKey: keys.secretAccessKey
    },
    region: 'ap-southeast-1'
});

function getContentTypeByFile(fileName) {
    var rc = 'application/octet-stream';
    var fn = fileName.toLowerCase();

    if (fn.indexOf('.html') >= 0) rc = 'text/html';
    else if (fn.indexOf('.css') >= 0) rc = 'text/css';
    else if (fn.indexOf('.json') >= 0) rc = 'application/json';
    else if (fn.indexOf('.js') >= 0) rc = 'application/x-javascript';
    else if (fn.indexOf('.png') >= 0) rc = 'image/png';
    else if (fn.indexOf('.jpg') >= 0) rc = 'image/jpg';

    return rc;
}

module.exports = app => {
    app.get('/api/upload', requireLogin, (req, res) => {
        const key = `${req.user.id}/${uuid()}.jpeg`

        s3.getSignedUrl('putObject', {
            Bucket: 'tio-blog-bucket',
            ContentType: 'image/png',
            Key: key,
        }, (err, url) => {
            res.send({ key, url });
        });
    });
};


