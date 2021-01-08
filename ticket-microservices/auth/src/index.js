const mongoose = require('mongoose');
const app = require('./app');

const start = async () => {

    if (!process.env.JWT_KEY) {
        throw new Error('JWT_KEY is missing!');
    }

    try {
        await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });
        console.log("Connected to DB");
        app.listen(3000, () => {
            console.log('Auth Service is listening on port 3000!');
        });
    } catch (err) {
        console.log(err);
        throw new Error(err);
    }
}

start();
