const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const app = require('./../index');

let mongo;

// Hook function
// Run before all test code
beforeAll(async () => {
    mongo = new MongoMemoryServer();
    const mongoURI = await mongo.getUri();

    await mongoose.connect(mongoURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
});

// Hook function
// Run before each test start
beforeEach(async () => {
    const collections = await mongoose.connection.db.collections();
    for (let collection of collections) {
        await collection.deleteMany({});
    }
});

// Hook function
afterAll(async () => {
    await mongo.stop();
    await mongoose.connection.close();
});

// Global function
global.logIn = async () => {
    const email = 'test@test.com';
    const password = '123123';

    await request(app)
        .post('/api/users/signUp')
        .send({
            email,
            password
        })
        .expect(201);


    const response = await request(app)
        .post('/api/users/logIn')
        .send({
            email,
            password
        })
        .expect(200);

    const cookie = response.get('Set-Cookie');
    return cookie;
};