const express = require('express');
const router = express.Router();

router.post('/signin', (req, res, next) => {
    res.send('Hello world!');
});

router.post('/signup', (req, res, next) => {
    res.send('Hello world!');
});

router.post('/signout', (req, res, next) => {
    res.send('Hello world!');
});

router.get('/currentUser', (req, res, next) => {
    res.send('Hello world!');
});

module.exports = router;