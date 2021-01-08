const request = require('supertest');
const app = require('../../app');
const mongoose = require('mongoose');
const Order = require('./../../models/Order');
const Ticket = require('./../../models/Ticket');
const { OrderStatus } = require('@tioticket/common');

const cookie = global.logIn();
const secondUser = global.secondUser();

it('Get all tickets', async () => {
    const list = await Ticket.find({}).lean();
    console.log(list);
})

// const createTicket = async () => {
//     const ticket = new Ticket({
//         title: 'concert',
//         price: 20
//     });
//     await ticket.save();
//     return ticket;
// }

// describe('Create Order', () => {
//     it('Returns error if the ticket does not exist', async () => {
//         const ticketId = mongoose.Types.ObjectId();

//         await request(app)
//             .post('/api/orders')
//             .set('Cookie', cookie)
//             .send({ ticketId })
//             .expect(404);
//     });

//     it('Returns error if the ticket is already reserved', async () => {
//         const ticket = new Ticket({
//             title: 'concert',
//             price: 20
//         });
//         await ticket.save();

//         const order = new Order({
//             ticket,
//             userId: 'asdasdasd',
//             status: OrderStatus.Created,
//             expiresAt: new Date()
//         })
//         await order.save();

//         await request(app)
//             .post('/api/orders')
//             .set('Cookie', cookie)
//             .send({ ticketId: ticket.id })
//             .expect(400);
//     });

//     it('Reserves a ticket', async () => {
//         const ticket = new Ticket({
//             title: 'concert',
//             price: 20
//         });
//         await ticket.save();

//         await request(app)
//             .post('/api/orders')
//             .set('Cookie', cookie)
//             .send({ ticketId: ticket.id })
//             .expect(201);
//     });

//     it.todo('Publish event');
// });

// describe('Get Orders', () => {
//     it('Get orders for a particular user', async () => {
//         const ticketOne = await createTicket();
//         const ticketTwo = await createTicket();
//         const ticketThree = await createTicket();

//         await request(app)
//             .post('/api/orders')
//             .set('Cookie', cookie)
//             .send({ ticketId: ticketOne.id })
//             .expect(201);

//         await request(app)
//             .post('/api/orders')
//             .set('Cookie', secondUser)
//             .send({ ticketId: ticketTwo.id })
//             .expect(201);

//         await request(app)
//             .post('/api/orders')
//             .set('Cookie', secondUser)
//             .send({ ticketId: ticketThree.id })
//             .expect(201);

//         // Get orders
//         const response = await request(app)
//             .get('/api/orders')
//             .set('Cookie', secondUser)
//             .send()
//             .expect(200);

//         expect(response.body.data.length).toBe(2);
//     });

//     it('Get single order', async () => {
//         const ticket = await createTicket();

//         const { body: { data } } = await request(app)
//             .post('/api/orders')
//             .set('Cookie', cookie)
//             .send({ ticketId: ticket.id })
//             .expect(201);

//         const { body } = await request(app)
//             .get(`/api/orders/${data.id}`)
//             .set('Cookie', cookie)
//             .send()
//             .expect(200);
//     })
// })

// describe('Delete Orders', () => {
//     // 
// })