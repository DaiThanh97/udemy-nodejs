const mongoose = require('mongoose');

const connect = async (callback) => {
    try {
        await mongoose.connect('mongodb://auth-mongo-srv:27017/auth', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });
        console.log("Connected to DB");
        callback();
    } catch (err) {
        console.log(err);
        throw new Error('Connect Failed!');
    }
}

module.exports = connect;