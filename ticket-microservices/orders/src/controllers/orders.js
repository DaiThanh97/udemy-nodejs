const {
    asyncHandler,
    StatusCode,
    OrderStatus,
    Entity: { Response, CustomError }
} = require('@tioticket/common');
const Ticket = require('./../models/Ticket');
const Order = require('./../models/Order');
const { OrderCreatedPublisher, OrderCancelledPublisher } = require('../events/publisher/order.publisher');
const natsWrapper = require('../nats-wrapper');

// @desc    Create new order
// @route   POST /api/orders
// @access  PRIVATE
exports.createOrder = asyncHandler(async (req, res, next) => {
    const { ticketId } = req.body;

    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
        throw new CustomError(StatusCode.NOT_FOUND, 'Ticket not existed!');
    }

    const isReserved = await ticket.isReserved();
    if (isReserved) {
        throw new CustomError(StatusCode.BAD_REQUEST, 'Ticket is reserved!');
    }

    // Set expires time
    const expiration = new Date();
    expiration.setMinutes(expiration.getMinutes() + process.env.ORDER_EXPIRATION);

    // Save to DB
    const order = new Order({
        userId: req.currentUser.id,
        status: OrderStatus.Created,
        expiresAt: expiration,
        ticket
    });
    await order.save();

    // Publish event
    new OrderCreatedPublisher(natsWrapper.getClient()).publish({
        id: order.id,
        status: order.status,
        userId: order.userId,
        expiresAt: expiration.toISOString(),
        version: order.version,
        ticket: {
            id: ticket.id,
            price: ticket.price
        }
    });

    // Response
    res.status(StatusCode.CREATED)
        .json(new Response('Create order success!', order));
});

// @desc    Get order with id
// @route   GET /api/orders/:id
// @access  PRIVATE
exports.getOrder = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const order = await Order.findById(id).populate('ticket').lean();
    if (!order) {
        throw new CustomError(StatusCode.NOT_FOUND, 'Ticket not found!');
    }

    if (order.userId !== req.currentUser.id) {
        throw new CustomError(StatusCode.UNAUTHORIZED, 'Not authorized to view order!');
    }

    // Response
    res.status(StatusCode.SUCCESS)
        .json(new Response('Get order success!', order));
});

// @desc    Get list orders
// @route   GET /api/orders
// @access  PRIVATE
exports.getOrders = asyncHandler(async (req, res, next) => {
    const orders = await Order.find({ userId: req.currentUser.id }).populate('ticket').lean();

    // Response
    res.status(StatusCode.SUCCESS)
        .json(new Response('Get list orders success!', orders));
});

// @desc    Update a order
// @route   PUT /api/orders/:id
// @access  PRIVATE
exports.updateOrder = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    let ticket = await Ticket.findById(id);
    if (!ticket) {
        throw new CustomError(StatusCode.NOT_FOUND, 'Ticket not found!');
    }

    // Check authorized
    if (ticket.userId !== req.currentUser.id) {
        throw new CustomError(StatusCode.UNAUTHORIZED, 'No permission to update this ticket!');
    }

    const { title, price } = req.body;
    ticket.title = title;
    ticket.price = price;
    await ticket.save();

    // Publish event 
    new TicketUpdatedPublisher(natsWrapper.getClient()).publish({
        id: ticket.id,
        title: ticket.title,
        price: ticket.price,
        userId: ticket.userId
    });

    // Response
    res.status(StatusCode.SUCCESS)
        .json(new Response('Update ticket success!', ticket));
});

// @desc    Delete order
// @route   DELETE /api/orders/:id
// @access  PRIVATE
exports.deleteOrders = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    const order = await Order.findById(id).populate('ticket');
    if (!order) {
        throw new CustomError(StatusCode.NOT_FOUND, 'Order not found!');
    }

    if (order.userId !== req.currentUser.id) {
        throw new CustomError(StatusCode.UNAUTHORIZED, 'Not authorized!');
    }

    order.status = OrderStatus.Cancelled;
    await order.save();

    // Publish event
    new OrderCancelledPublisher(natsWrapper.getClient()).publish({
        id: order.id,
        version: order.version,
        ticket: {
            id: order.ticket.id,
            price: order.ticket.price,
        }
    });

    // Response
    res.status(StatusCode.SUCCESS)
        .json(new Response('Get list orders success!'));
});