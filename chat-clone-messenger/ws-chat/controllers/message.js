const MessageModel = require('../models/Message');
const CustomError = require('../utils/customError');

exports.getMessages = async (roomId) => {
    try {
        const messages = await MessageModel.find({ roomId }).lean();
        return messages;
    } catch (err) {
        throw new CustomError('Get Messages Failed!', 500);
    }
}

exports.saveMessage = async (roomId, userId, nick, message) => {
    try {
        const room = await MessageModel.findOne({ roomId });
        if (room) {
            room.messages.push({
                userId,
                nick,
                message
            });
            return room.save();
        }

        await MessageModel.create({
            roomId,
            messages: [{
                userId,
                nick,
                message
            }]
        });
    } catch (err) {
        throw new CustomError('Save Messages Failed!', 500);
    }
}