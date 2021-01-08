const mongoose = require('mongoose');
const { OrderStatus } = require('@tioticket/common');
const { updateIfCurrentPlugin } = require('mongoose-update-if-current');

const OrderSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: Object.values(OrderStatus),
        default: OrderStatus.Created
    },
    expiresAt: {
        type: Date,
    },
    ticket: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Ticket'
    }
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
        }
    }
});
OrderSchema.set('versionKey', 'version');
OrderSchema.plugin(updateIfCurrentPlugin);

module.exports = mongoose.model('Order', OrderSchema);