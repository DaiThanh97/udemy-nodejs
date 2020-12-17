const mongoose = require('mongoose');

const FriendSchema = new mongoose.Schema({
    userId: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
    },
    friends: [
        {
            friendId: {
                type: mongoose.SchemaTypes.ObjectId,
                required: true,
                ref: 'User'
            },
        }
    ],
    pendingFriends: [
        {
            friendId: {
                type: mongoose.SchemaTypes.ObjectId,
                required: true,
                ref: 'User'
            },
        }
    ],
});


FriendSchema.methods.addPendingFriend = async function (reqAddUserId) {
    const check = this.pendingFriends.find(user => user.friendId.toString() === reqAddUserId);
    if (check) {
        return new Error('Add pending friend failed!');
    }

    this.pendingFriends.push({
        friendId: reqAddUserId,
    });
    return await this.save();
}

FriendSchema.methods.addFriend = async function (reqAddUserId) {
    const check = this.friends.find(user => user.friendId.toString() === reqAddUserId);
    if (check) {
        return new Error('Friend is already added!');
    }

    // Remove from pending
    this.pendingFriends = this.pendingFriends.filter(fr => fr.friendId.toString() !== reqAddUserId)

    this.friends.push({
        friendId: reqAddUserId,
    });
    return await this.save();
}

module.exports = mongoose.model('Friend', FriendSchema);