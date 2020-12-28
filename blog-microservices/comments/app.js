const express = require('express');
const crypto = require('crypto');
const cors = require('cors');
const axios = require('axios');

const app = express();

app.use(express.json());
app.use(cors());

const commentsByPostId = [];

app.get('/posts/:id/comments', (req, res, next) => {
    const { id } = req.params;
    const post = commentsByPostId.find(p => p.id === id);
    let comments = post ? post.comments : [];
    res.json({
        comments
    });
});

app.post('/posts/:id/comments', async (req, res, next) => {
    const commentId = crypto.randomBytes(4).toString('hex');
    const { content } = req.body;
    const { id } = req.params;

    let post = commentsByPostId.find(p => p.id === id);
    if (!post) {
        post = { id, comments: [] };
        commentsByPostId.push(post);
    }
    const { comments } = post;
    const cmt = { id: commentId, content, status: 'pending' };
    comments.push(cmt);

    let event = {
        type: 'CommentCreated',
        data: {
            id: commentId,
            content,
            postId: id,
            status: 'pending'
        }
    };
    await axios.post('http://event-bus-srv:4005/events', event);

    res.status(201).json({
        cmt
    });
});

app.post('/events', async (req, res, next) => {
    console.log('Received Event ', req.body.type);

    const { type, data } = req.body;

    if (type === "CommentModerated") {
        const { postId, id, status } = data;
        const { comments } = commentsByPostId[postId];
        const cmt = comments.find(c => c.id === id);
        cmt.status = status;

        await axios.post('http://event-bus-srv:4005/events', {
            type: 'CommentUpdated',
            data: cmt
        });
    }

    res.json({});
});

app.listen(4001, () => {
    console.log('Server listenning in port 4001')
});