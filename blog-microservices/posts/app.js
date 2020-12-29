const express = require('express');
const crypto = require('crypto');
const cors = require('cors');
const axios = require('axios');

const app = express();

app.use(express.json());
app.use(cors());

const posts = [];

app.get('/posts', (req, res, next) => {
    res.send(posts);
});

app.post('/posts/create', async (req, res, next) => {
    const id = crypto.randomBytes(4).toString('hex');
    const { title } = req.body;

    const post = { id, title };
    posts.push(post);

    // Send an event to the Event Bus
    let event = {
        type: 'PostCreated',
        data: post
    };
    await axios.post('http://event-bus-srv:4005/events', event);

    res.status(201).json({
        post
    });
});

app.post('/events', (req, res, next) => {
    console.log('Received Event ', req.body.type);
    res.json({});
});

app.listen(4000, () => {
    console.log("Naruto a");
    console.log('Server listenning in port 4000')
});