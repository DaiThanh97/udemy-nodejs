const express = require('express');

const authRoute = require('./routes/auth');

const app = express();

app.use(express.json());

app.get('/', (req, res, next) => {
    res.send("Hi there!");
})

// app.use(authRoute);

app.listen(4000, () => {
    console.log('Listening on port 4000!');
})