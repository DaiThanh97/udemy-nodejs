const connectDB = require('./configs/db');

const app = require('./index');

// Connect to DB
connectDB(() => {
    if (!process.env.JWT_KEY) {
        throw new Error('JWT_KEY must be defined!');
    }
    app.listen(process.env.PORT || 3000, () => {
        console.log('Auth Service is listening on port 3000!');
    });
});
