require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');

const {
    errorHandler,
    StatusCode,
    Entity: { CustomError }
} = require('@tioticket/common');
const paymentRoute = require('./routes/payment');

const app = express();
// app.set('trust proxy', true);
app.use(express.json());
app.use(cookieParser());

// Route
app.use('/api/payments', paymentRoute);

// Catch 404 error
app.use((req, res, next) => {
    next(new CustomError(StatusCode.NOT_FOUND, 'Not Found!'));
});

// Error Handler
app.use(errorHandler);

module.exports = app;