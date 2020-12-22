require('dotenv').config();
const express = require('express');
const cors = require('cors');

const connectDB = require('./configs/db');
const socketio = require('./utils/socketio');

const app = express();
app.use(cors());

// Connect DB
connectDB();

// Init socketIO
socketio.init(app.listen(process.env.PORT || 5001));


