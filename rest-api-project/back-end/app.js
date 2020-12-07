const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const mongoose = require('mongoose');
const multer = require('multer');

const feedRouter = require('./routes/feed');
const authRouter = require('./routes/auth');
const configs = require('./configs/configs');

const app = express();

// CONNECT DB
mongoose.connect(configs.DB_CONNECT_STR, { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
    if (err) {
        return next(err);
    }
    console.log('CONNECT DB SUCCESS!');
});
mongoose.set('useFindAndModify', false);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('(/public)?', express.static(path.join(__dirname, 'public')));

// Fix Cors Origin
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});
// Init multer
app.use(multer({ storage: configs.MULTER_CONFIG, fileFilter: configs.MULTER_FILE_FILTER }).single('image'));

// Router
app.use('/feed', feedRouter);
app.use('/auth', authRouter);

// Error Handler
app.use((err, req, res, next) => {
    const status = err.status || 500;
    const { message, data } = err;
    res.status(status).json({ message, data });
})

module.exports = app;
