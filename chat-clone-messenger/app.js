const path = require('path');
const http = require('http');

require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');

// Security
const helmet = require('helmet');
const hpp = require('hpp');
const rateLimit = require('express-rate-limit');
const xssClean = require('xss-clean');

// 
const errorHandler = require('./middlewares/errorHandler');
const connectDB = require('./configs/db');
const authRouter = require('./routes/auth');

const chatController = require('./controllers/chat');

const app = express();
const server = http.createServer(app);
connectDB();

// Init socket
chatController.initSocketIO(server);

app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(helmet()); // Add headers for security
app.use(hpp()); // // Prevent http params polution
app.use(xssClean()); // Prevent XSS attack
app.use(rateLimit({ // Rate limit access
    windowMs: 1000,
    max: 3
}));

// Router
app.use('/api/v1/auth', authRouter);

// Error handler
app.use(errorHandler);

server.listen(process.env.PORT || 5000, () => {
    console.log(`Server is running in ${process.env.NODE_ENV} mode in port ${process.env.PORT}`);
});