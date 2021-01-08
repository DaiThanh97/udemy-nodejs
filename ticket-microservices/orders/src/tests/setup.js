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
    jest.clearAllMocks();
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
    return "token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVmZjUyZTI1NGZmYzRjMDAxZjVhYjJlMyIsImVtYWlsIjoidGVzdEB0ZXN0LmNvbSIsImlhdCI6MTYwOTkwMzY1NywiZXhwIjoxNjA5OTkwMDU3fQ.OD-4e-ShIqRTD-eoWVL7D4_BrbIVobeofDRY6IuRBHk";
};

global.secondUser = () => {
    return "token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVmZjU4N2JmZGZiYWQ4MDAxZjFiNWM3NCIsImVtYWlsIjoidGVzdDFAdGVzdC5jb20iLCJpYXQiOjE2MDk5MjY1OTYsImV4cCI6MTYxMDAxMjk5Nn0.RcoFKSMtz9or61-qwNIdVtLyW2j-9JC_DwuUHMIVa1c";
}