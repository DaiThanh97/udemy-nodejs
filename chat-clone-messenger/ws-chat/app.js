require('dotenv').config();
const express = require('express');
const expressWs = require('express-ws');

const connectDB = require('./configs/db');
const socketService = require('./services/socketio');

const app = express();
expressWs(app);
// Connect DB
connectDB();

app.ws('/', (ws, req) => {
    ws.send('Connected');
})

const server = app.listen(process.env.PORT || 5001, () => {
    console.log(`Server is running in ${process.env.NODE_ENV} mode in port ${process.env.PORT}`);
});

// init socketio
// socketService.init(server);

