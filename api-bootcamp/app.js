const path = require('path');

require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const expressFileUpload = require('express-fileupload');

const connectDB = require('./configs/db');
const bootcampRouter = require('./routes/bootcamp');
const courseRouter = require('./routes/course');
const authRouter = require('./routes/auth');

const app = express();

// Connect to mongoDB
connectDB();

app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(expressFileUpload());
app.use(express.static(path.join(__dirname, 'public')));

// Routers
app.use('/api/v1/bootcamps', bootcampRouter);
app.use('/api/v1/courses', courseRouter);
app.use('/api/v1/auth', authRouter);

// Error handler
app.use((err, req, res, next) => {
    const { message, status } = err;
    res.status(status || 500).json({
        success: false,
        message
    });
})

app.listen(process.env.PORT || 5000, () => {
    console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${process.env.PORT}`)
});
