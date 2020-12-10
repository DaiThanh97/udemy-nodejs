const path = require('path');

require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const connectDB = require('./configs/db');
const bootcampRouter = require('./routes/bootcamp');

const app = express();
connectDB();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Routers
app.use('/api/v1/bootcamps', bootcampRouter);

// Error handler
app.use((err, req, res, next) => {
    console.log(err);
    const { message, status } = err;
    res.status(status || 500).json({
        success: false,
        message
    });
})

app.listen(process.env.PORT || 3000);
