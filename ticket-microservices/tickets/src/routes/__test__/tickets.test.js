const request = require('supertest');
const app = require('../../app');
const Ticket = require('../../models/Ticket');
const mongoose = require('mongoose');

// Get cookie for test
const cookie = global.logIn();

const createTicket = () => {
    return request(app)
        .post('/api/tickets')
        .set('Cookie', cookie)
        .send({
            title: 'abc',
            price: 20
        });
};

describe('Create new ticket', () => {
    it('Has a route handler listening to /api/tickets for POST', async () => {
        const response = await request(app).post('/api/tickets').send({});

        expect(response.status).not.toEqual(404);
    });

    it('Only be accessed if the user is signed in', async () => {
        await request(app)
            .post('/api/tickets')
            .send({})
            .expect(401);
    });

    it('Returns a status different from 401 if the user is signed in', async () => {
        const response = await request(app)
            .post('/api/tickets')
            .set('Cookie', cookie)
            .send({});

        expect(response.status).not.toEqual(401);
    });

    it('Returns error if an invalid title is provided', async () => {
        await request(app)
            .post('/api/tickets')
            .set('Cookie', cookie)
            .send({
                title: "",
                price: 10
            })
            .expect(400);

        await request(app)
            .post('/api/tickets')
            .set('Cookie', cookie)
            .send({
                price: 10
            })
            .expect(400);
    });

    it('Returns error if an invalid price if provided', async () => {
        await request(app)
            .post('/api/tickets')
            .set('Cookie', cookie)
            .send({
                title: "lala",
                price: -10
            })
            .expect(400);

        await request(app)
            .post('/api/tickets')
            .set('Cookie', cookie)
            .send({
                title: "lala",
            })
            .expect(400);
    });

    it('Create a ticket with valid inputs', async () => {
        let tickets = await Ticket.find({});
        expect(tickets.length).toBe(0);

        await request(app)
            .post('/api/tickets')
            .set('Cookie', cookie)
            .send({
                title: "lele",
                price: 20
            })
            .expect(201);

        tickets = await Ticket.find({});
        expect(tickets.length).toBe(1);
        expect(tickets[0].price).toBe(20);
    });
});

describe('Fetch ticket', () => {
    it('Returns a 404 if the ticket is not found', async () => {
        const id = new mongoose.Types.ObjectId().toHexString();
        await request(app)
            .get(`/api/tickets/${id}`)
            .send({})
            .expect(404);
    });

    it('Returns the ticket if the ticket is found', async () => {
        const title = "concert";
        const price = 20;
        const response = await request(app)
            .post('/api/tickets')
            .set('Cookie', cookie)
            .send({
                title, price
            })
            .expect(201);

        const ticketResponse = await request(app)
            .get(`/api/tickets/${response.body.data.id}`)
            .send()
            .expect(200);

        expect(ticketResponse.body.data.title).toBe(title);
        expect(ticketResponse.body.data.price).toBe(price);
    });

    it('Can fetch a list of tickets', async () => {
        await createTicket();
        await createTicket();
        await createTicket();

        const response = await request(app)
            .get('/api/tickets')
            .send()
            .expect(200);

        expect(response.body.data.length).toBe(3);
    });
});

describe('Update ticket', () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    it('Returns 404 if the provided ID does not exist', async () => {
        await request(app)
            .put(`/api/tickets/${id}`)
            .set("Cookie", cookie)
            .send({
                title: 'asd',
                price: 20
            })
            .expect(404);
    });

    it('Returns 401 if the user is not authenticated', async () => {
        await request(app)
            .put(`/api/tickets/${id}`)
            .send({
                title: 'asd',
                price: 20
            })
            .expect(401);
    });

    it('Returns 401 if the user does not own the ticket', async () => {
        const response = await createTicket();

        await request(app)
            .put(`/api/tickets/${response.body.data.id}`)
            .set('Cookie', global.secondUser())
            .send({
                title: "lala",
                price: 1000
            })
            .expect(403);
    });

    it('Returns 400 if the user provide invalid title or price', async () => {
        const response = await createTicket();

        await request(app)
            .put(`/api/tickets/${response.body.data.id}`)
            .set('Cookie', cookie)
            .send({
                title: "",
                price: 20
            })
            .expect(400);

        await request(app)
            .put(`/api/tickets/${response.body.data.id}`)
            .set('Cookie', cookie)
            .send({
                title: "lalaa",
                price: -20
            })
            .expect(400);
    });

    it('Update the ticket with valid inputs', async () => {
        const response = await createTicket();

        await request(app)
            .put(`/api/tickets/${response.body.data.id}`)
            .set('Cookie', cookie)
            .send({
                title: 'New ticket',
                price: 100
            })
            .expect(200);

        const ticketUpdated = await request(app)
            .get(`/api/tickets/${response.body.data.id}`)
            .send();

        console.log("Ticket: ", ticketUpdated.body);
        expect(ticketUpdated.body.data.title).toBe('New ticket');
        expect(ticketUpdated.body.data.price).toBe(100);
    });
});