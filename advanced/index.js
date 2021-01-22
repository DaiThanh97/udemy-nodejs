const express = require('express');
const crypto = require('crypto');
const app = express();

app.get('/', (req, res) => {
    crypto.pbkdf2('a', 'b', 100000, 512, 'sha512', () => {
        res.send('Hello world!');
    });
});

app.get('/fast', (req, res) => {
    res.send('Super fast!');
});

app.listen(3000, () => {
    console.log("Server is listening on port 3000!");
});
