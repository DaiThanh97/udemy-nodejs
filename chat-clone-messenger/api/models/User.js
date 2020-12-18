const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
    },
    nick: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
        default: 'no-image.jpg',
    }
});

module.exports = mongoose.model('User', UserSchema);