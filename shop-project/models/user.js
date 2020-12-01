const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    resetToken: String,
    resetTokenExpiration: Date,
    cart: {
        items: [{
            productId: {
                type: mongoose.SchemaTypes.ObjectId,
                ref: 'Product',
                required: true,
            },
            quantity: {
                type: Number,
                required: true
            }
        }],
    }
});

// .methods is an object allows you to add your OWN method
// JUST AVAILABLE on instance of Model
// 'this' is current instance of model 
userSchema.methods.addToCart = function (product) {
    let { items } = this.cart;
    const productIndex = items.findIndex(prod => prod.productId.toString() === product._id.toString());

    if (productIndex >= 0) {
        items[productIndex].quantity++;
    }
    else {
        items.push({ productId: product._id, quantity: 1 });
    }
    this.cart = { items };
    return this.save();
};

userSchema.methods.deleteCart = function (productId) {
    let { items } = this.cart;
    items = items.filter(item => item.productId.toString() !== productId);
    this.cart = { items };
    return this.save()
};

userSchema.methods.clearCart = function () {
    this.cart = { items: [] };
    return this.save();
};

module.exports = mongoose.model('User', userSchema);