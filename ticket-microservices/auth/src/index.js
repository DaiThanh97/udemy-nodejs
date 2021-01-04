require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');

const {
    errorHandler,
    Entity: { CustomError }
} = require('@tioticket/common');
const authRoute = require('./routes/auth');

const app = express();
app.set('trust proxy', true);
app.use(express.json());
app.use(cookieParser());

app.use('/api/users', authRoute);

// Catch 404 error
app.use((req, res, next) => {
    next(new CustomError(404, 'Not Found!'));
});

// Error Handler
app.use(errorHandler);

module.exports = app;