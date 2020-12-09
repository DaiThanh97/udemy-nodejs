const path = require('path');
const fs = require('fs');
const https = require('https');

require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const multer = require('multer');
const helmet = require('helmet');
const compression = require('compression');

const feedRouter = require('./routes/feed');
const authRouter = require('./routes/auth');
const configs = require('./configs/configs');
const socket = require('./utils/socket');

const app = express();

// Config for HTTPS
// const privateKey = fs.readFileSync('server.key');
// const certificate = fs.readFileSync('server.cert');

// 'a' means 'append' to access.log
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });

// init helmet
app.use(helmet());
// init compression
app.use(compression());
app.use(morgan('combined', { stream: accessLogStream }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('(/public)?', express.static(path.join(__dirname, 'public')));

// Fix Cors Origin
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
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
});


// CONNECT DB
mongoose.set('useFindAndModify', false);
mongoose.connect(configs.DB_CONNECT_STR, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(result => {
        console.log('CONNECT DB SUCCESS!');

        // Start listen when connect DB success
        const server = app.listen(process.env.PORT || 8080);
        // HTTPS
        // const server = https.createServer({ key: privateKey, cert: certificate }, app);
        // server.listen(process.env.PORT || 8080);

        const io = socket.init(server);
        io.on('connection', socket => {
            console.log('Client connected');
            io.emit('hello', 'bye');
        });
    })
    .catch(err => next(err));

// app.listen(port) ~~ const server = http.createServer(app);
//               server.listen(port);