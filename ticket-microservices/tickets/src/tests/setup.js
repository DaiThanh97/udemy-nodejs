const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

let mongo;

// Hook function
// Run before all test code
beforeAll(async () => {
    process.env.JWT_KEY = "rb4Ue77nqr1EonjklrJN93P6TZOLMNE3"

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
global.logIn = () => {
    return "token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVmZjE2ZDgwMGYwNWQ4MDAzM2ZkM2MzNSIsImVtYWlsIjoidGVzdEB0ZXN0LmNvbSIsImlhdCI6MTYwOTY1NzczNywiZXhwIjoxNjA5NzQ0MTM3fQ.6Pm4ctN2YcFmFFJRKOKZh68uLrObOlu_q6Jtl7tu6OI";
};

global.secondUser = () => {
    return "token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVmZjE3MWQ1MGYwNWQ4MDAzM2ZkM2MzNiIsImVtYWlsIjoidGVzdDFAdGVzdC5jb20iLCJpYXQiOjE2MDk2NTg4NDMsImV4cCI6MTYwOTc0NTI0M30.7XFiA3jpasb0laV-Aq5dKGz0adPZqGG5rUE_OdRF3dI";
}