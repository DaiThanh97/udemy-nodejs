const { check } = require('express-validator');

createPost = () => {
    return [
        check('title', 'Title must at least 5 characters length!').isLength({ min: 5 }).trim(),
        check('content', 'Content must at least 5 characters length!').isLength({ min: 5 }).trim()
    ];
}

updatePost = () => {
    return [
        check('title', 'Title must at least 5 characters length!').isLength({ min: 5 }).trim(),
        check('content', 'Content must at least 5 characters length!').isLength({ min: 5 }).trim()
    ];
}

module.exports = {
    createPost,
    updatePost
}