const {
    asyncHandler,
    StatusCode,
    Entity: { Response, CustomError }
} = require('@tioticket/common');
const Ticket = require('./../models/Ticket');
const { TicketCreatedPublisher, TicketUpdatedPublisher } = require('../events/publisher/ticket.publisher');
const natsWrapper = require('./../nats-wrapper');

// @desc    Create new ticket
// @route   POST /api/tickets
// @access  PRIVATE
exports.createTicket = asyncHandler(async (req, res, next) => {
    const { title, price } = req.body;

    const ticket = new Ticket({
        title,
        price,
        userId: req.currentUser.id
    });
    await ticket.save();

    // Publish event 
    await new TicketCreatedPublisher(natsWrapper.getClient()).publish({
        id: ticket.id,
        title: ticket.title,
        price: ticket.price,
        userId: ticket.userId,
        version: ticket.version
    });

    // Response
    res.status(StatusCode.CREATED)
        .json(new Response('Create ticket success!', ticket));
});

// @desc    Get ticket with id
// @route   GET /api/tickets/:id
// @access  PUBLIC
exports.getTicket = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const ticket = await Ticket.findById(id).lean();
    if (!ticket) {
        throw new CustomError(StatusCode.NOT_FOUND, 'Ticket not found!');
    }

    // Response
    res.status(StatusCode.SUCCESS)
        .json(new Response('Get ticket success!', ticket));
});

// @desc    Get list tickets
// @route   GET /api/tickets
// @access  PUBLIC
exports.getTickets = asyncHandler(async (req, res, next) => {
    const tickets = await Ticket.find({}).lean();

    // Response
    res.status(StatusCode.SUCCESS)
        .json(new Response('Get list tickets success!', tickets));
});

// @desc    Update a ticket
// @route   PUT /api/tickets/:id
// @access  PRIVATE
exports.updateTicket = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const ticket = await Ticket.findById(id);
    if (!ticket) {
        throw new CustomError(StatusCode.NOT_FOUND, 'Ticket not found!');
    }

    // Check locked down ticket
    if (ticket.orderId) {
        throw new CustomError(StatusCode.BAD_REQUEST, 'Cannot edit a reserved ticket!');
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
        userId: ticket.userId,
        version: ticket.version
    });

    // Response
    res.status(StatusCode.SUCCESS)
        .json(new Response('Update ticket success!', ticket));
});