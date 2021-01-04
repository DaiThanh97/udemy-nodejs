require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');

const {
    errorHandler,
    StatusCode,
    Entity: { CustomError }
} = require('@tioticket/common');
const connectDB = require('./configs/db');
const authRoute = require('./routes/auth');

const app = express();
// By default Express won't trust the proxy without SSL
// So we have to set 'trust proxy' for Express to allow traffic
// app.set('trust proxy', true);
app.use(express.json());
app.use(cookieParser());

app.use('/api/users', authRoute);

// Catch 404 error
app.use((req, res, next) => {
    next(new CustomError(StatusCode.NOT_FOUND, 'Not Found!'));
});

// Error Handler
app.use(errorHandler);

// Connect to DB
connectDB(() => {
    app.listen(3000, () => {
        console.log('Auth Service is listening on port 3000!');
    });
});

module.exports = app;