const mongoose = require('mongoose');
const { OrderStatus } = require('@tioticket/common');
const { updateIfCurrentPlugin } = require('mongoose-update-if-current');

const TicketSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0,
    }
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
        }
    },
});
TicketSchema.set('versionKey', 'version');
TicketSchema.plugin(updateIfCurrentPlugin);

TicketSchema.methods.isReserved = async function () {
    const existingOrder = await this.model('Order').findOne({
        ticket: this,
        status: { $ne: OrderStatus.Cancelled }
    });
    return !!existingOrder;
};

TicketSchema.statics.findByEvent = function (id, version) {
    return this.findOne({
        _id: id,
        version: version - 1
    });
}

module.exports = mongoose.model('Ticket', TicketSchema);