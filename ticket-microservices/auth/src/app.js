require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');

const authRoute = require('./routes/auth');
const { errorHandler } = require('./middlewares/error');
const { CustomError } = require('./utils/response');
const connectDB = require('./configs/db');

const app = express();
app.set('trust proxy', true);
app.use(express.json());
app.use(cookieParser());

app.use('/api/users', authRoute);

// Catch 404 error
app.use((req, res, next) => {
    next(new CustomError(404, 'Not Found!'));
});

// Error Handler
app.use(errorHandler);

// Connect to DB
connectDB(() => {
    if (!process.env.JWT_KEY) {
        throw new Error('JWT_KEY must be defined!');
    }
    app.listen(process.env.PORT || 3000, () => {
        console.log('Auth Service is listening on port 3000!');
    });
});
