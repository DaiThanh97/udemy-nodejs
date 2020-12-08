const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const mongoose = require('mongoose');

const configs = require('./configs/configs');
const userRouter = require('./routes/user');
const productRouter = require('./routes/product');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Connect DB
mongoose.connect(configs.DB_CONNECT_STR, { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
    if (err) {
        return next(err);
    }
    console.log('Connect DB success');
});

// Fix cors
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
})

// Router
app.use('/user', userRouter);
app.use('/product', productRouter);

// Error Handling
app.use((err, req, res, next) => {
    const status = err.status || 500;
    const { message, data } = err;
    res.status(status).json({ message, data });
})

module.exports = app;
