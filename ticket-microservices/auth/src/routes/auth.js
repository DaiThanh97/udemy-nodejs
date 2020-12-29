const express = require('express');
const router = express.Router();

router.post('/api/users/signin', (req, res, next) => {
    res.send('Hello world!');
});

router.post('/api/users/signup', (req, res, next) => {
    res.send('Hello world!');
});

router.post('/api/users/signout', (req, res, next) => {
    res.send('Hello world!');
});

router.get('/api/users/currentUser', (req, res, next) => {
    res.send('Hello world!');
});

module.exports = router;