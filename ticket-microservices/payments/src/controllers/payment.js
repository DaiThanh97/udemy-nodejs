const stripe = require('./../stripe');

const {
    asyncHandler,
    StatusCode,
    OrderStatus,
    Entity: { CustomError, Response },
} = require('@tioticket/common');
const Order = require('./../models/Order');
const Payment = require('./../models/Payment');
const { PaymentCreatedPublisher } = require('./../events/publisher/payment.publisher');
const natsWrapper = require('./../nats-wrapper');

exports.createPayment = asyncHandler(async (req, res, next) => {
    const { token, orderId } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
        throw new CustomError(StatusCode.NOT_FOUND, 'Order not found!');
    }

    if (order.userId !== req.currentUser.id) {
        throw new CustomError(StatusCode.UNAUTHORIZED, 'Not authorized!');
    }

    if (order.status === OrderStatus.Cancelled) {
        throw new CustomError(StatusCode.BAD_REQUEST, 'Cannot pay for an cancelled order!');
    }

    const charge = await stripe.charges.create({
        currency: 'usd',
        amount: order.price * 100,
        source: token,
        description: 'Test charge',
    });

    const payment = new Payment({
        orderId: orderId,
        stripeId: charge.id
    });
    await payment.save();

    await new PaymentCreatedPublisher(natsWrapper.getClient()).publish({
        id: payment.id,
        orderId: payment.orderId,
        stripeId: payment.stripeId
    });

    // Response
    res.status(StatusCode.SUCCESS)
        .json(new Response('Create payment sucess!', { id: payment.id }));
});