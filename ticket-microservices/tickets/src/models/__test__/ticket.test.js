const Ticket = require('./../Ticket');

it('Implement OCC', async (done) => {
    const ticket = new Ticket({
        title: 'concert',
        price: 5,
        userId: '123'
    });
    await ticket.save();

    const firstInstance = await Ticket.findById(ticket.id);
    const secondInstance = await Ticket.findById(ticket.id);

    firstInstance.price = 10;
    secondInstance.price = 15;

    await firstInstance.save();
    try {
        await secondInstance.save();
    }
    catch (err) {
        return done();
    }

    throw new Error('Should not reach this point!');
});

it('Increments version number on multiple saves', async () => {
    const ticket = new Ticket({
        title: 'concert',
        price: 5,
        userId: '123'
    });
    await ticket.save();
    expect(ticket.version).toBe(0);

    await ticket.save();
    expect(ticket.version).toBe(1);

    await ticket.save();
    expect(ticket.version).toBe(2);
});