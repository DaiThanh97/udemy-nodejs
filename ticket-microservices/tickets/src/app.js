const express = require('express');
const cookieParser = require('cookie-parser');

const {
    errorHandler,
    StatusCode,
    Entity: { CustomError }
} = require('@tioticket/common');
const connectDB = require('./configs/db');
const ticketRoute = require('./routes/tickets');

const app = express();
// app.set('trust proxy', true);
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/tickets', ticketRoute);

// Catch 404 error
app.use((req, res, next) => {
    next(new CustomError(StatusCode.NOT_FOUND, 'Not Found!'));
});

// Error Handler
app.use(errorHandler);

// Connect to DB
connectDB(() => {
    app.listen(3000, () => {
        console.log('Tickets Service is listening on port 3000!');
    });
});

module.exports = app;