const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

app.post('/events', async (req, res, next) => {
    const { type, data } = req.body;

    if (type === "CommentCreated") {
        const status = data.content.includes('orange') ? 'rejected' : 'approved';
        data.status = status;
        await axios.post('http://localhost:4005', {
            type: 'CommentModerated',
            data: data
        });
    }

    res.json({});
});

app.listen(4003, () => {
    console.log('Server listenning in port 4003')
});