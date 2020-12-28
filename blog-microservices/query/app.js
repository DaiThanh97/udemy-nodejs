const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(express.json());
app.use(cors());

const posts = [];

// Mock data
// [
//     'gdfl': {
//         id: 'gdfl',
//         title: 'Lucian',
//         comments: [
//             {
//                 id: 'lgekr',
//                 content: 'Hello'
//             }
//         ]
//     }
// ]

const handleEvent = (type, data) => {
    switch (type) {
        case 'PostCreated': {
            const { id, title } = data;
            posts.push({ id, title, comments: [] });
            break;
        }
        case 'CommentCreated': {
            const { id, content, postId, status } = data;
            const post = posts.find(p => p.id === postId);
            post.comments.push({ id, content, status });
            break;
        }
        case 'CommentUpdated': {
            const { id, postId, content, status } = data;
            const post = posts.find(p => p.id === postId);
            const { comments } = post;
            const cmt = comments.find(c => c.id === id);
            cmt.status = status;
            cmt.content = content;
            break;
        }
    }

}

app.get('/posts', (req, res, next) => {
    res.json(posts);
});

app.post('/events', (req, res, next) => {
    const { type, data } = req.body;
    handleEvent(type, data);
    res.json({});
});

app.listen(4002, async () => {
    console.log('Server listenning in port 4002');

    const res = await axios.get('http://event-bus-srv:4005/events');
    for (let event of res.data) {
        console.log(event.type);
        handleEvent(event.type, event.data);
    }
});