require('dotenv').config();
const express = require('express');
const cors = require('cors');

const connectDB = require('./configs/db');
const socketio = require('./controllers/socketio');

const app = express();
app.use(cors());
// Connect DB
connectDB();

// init socketio
socketio.init(
    app.listen(process.env.PORT || 5001, () => {
        console.log(`Server is running in ${process.env.NODE_ENV} mode in port ${process.env.PORT}`);
    })
);


