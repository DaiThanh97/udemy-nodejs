require('dotenv').config();
const express = require('express');
const morgan = require('morgan');

const connectDB = require('./configs/db');
const bootcampRouter = require('./routes/bootcamp');
const courseRouter = require('./routes/course');

const app = express();

// Connect to mongoDB
connectDB();

app.use(morgan('dev'));
app.use(express.json());

// Routers
app.use('/api/v1/bootcamps', bootcampRouter);
app.use('/api/v1/courses', courseRouter);

// Error handler
app.use((err, req, res, next) => {
    console.log(err);
    const { message, status } = err;
    res.status(status || 500).json({
        success: false,
        message
    });
})

app.listen(process.env.PORT || 5000, () => console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${process.env.PORT}`));
