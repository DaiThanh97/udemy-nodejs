const express = require('express');

const authRoute = require('./routes/auth');

const app = express();

app.use(express.json());

app.use('/api/users', authRoute);

app.listen(3000, () => {
    console.log('Listening on port 3000!');
})