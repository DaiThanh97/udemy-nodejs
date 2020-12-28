const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

const events = [];

app.post('/events', (req, res, next) => {
    const event = req.body;

    events.push(event);

    axios.post('http://posts-clusterip-srv:4000/events', event);
    axios.post('http://comments-srv:4001/events', event);
    axios.post('http://query-srv:4002/events', event);
    axios.post('http://moderation-srv:4003/events', event);

    res.json({ status: 'OK' });
});

app.get('/events', (req, res, next) => {
    res.json(events);
})

app.listen(4005, () => {
    console.log("HELLOO");
    console.log('Server listenning in port 4005')
});