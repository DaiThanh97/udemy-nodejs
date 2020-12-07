const express = require('express');
const router = express.Router();

const feedController = require('./../controllers/feed');
const feedValidation = require('./../validation/feed');
const isAuth = require('./../middleware/is-auth');

/* GET home page. */
router.get('/posts', isAuth, feedController.getPosts);

router.post('/create', isAuth, feedValidation.createPost(), feedController.createPost);

router.get('/post/:postId', isAuth, feedController.getPost);

router.put('/post/:postId', isAuth, feedValidation.updatePost(), feedController.updatePost);

router.delete('/post/:postId', isAuth, feedController.deletePost);

module.exports = router;
