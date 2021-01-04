const mongoose = require('mongoose');

const connect = async (callback) => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
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