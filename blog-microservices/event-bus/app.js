const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

const events = [];

app.post('/events', (req, res, next) => {
    const event = req.body;

    events.push(event);

    axios.post('http://localhost:4000/events', event);
    axios.post('http://localhost:4001/events', event);
    axios.post('http://localhost:4002/events', event);
    axios.post('http://localhost:4003/events', event);

    res.json({ status: 'OK' });
});

app.get('/events', (req, res, next) => {
    res.json(events);
})

app.listen(4005, () => {
    console.log('Server listenning in port 4005')
});