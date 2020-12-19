const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        unique: true
    },
    nick: {
        type: String
    },
    avatar: {
        type: String,
        default: 'no-image.jpg',
    },
    block: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('User', UserSchema);