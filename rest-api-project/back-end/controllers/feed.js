const fs = require('fs');
const path = require('path');

const { validationResult } = require('express-validator');

const PostModel = require('./../models/post');
const UserModel = require('./../models/user');

getPosts = async (req, res, next) => {
    const page = req.query.page || 1;
    const postPerPage = 3;
    try {
        const totalItems = await PostModel.countDocuments();
        const posts = await PostModel.find().skip(postPerPage * (page - 1)).limit(postPerPage).lean();

        // return response
        res.status(200).json({
            message: 'Fetch posts success!',
            posts,
            totalItems
        });
    } catch (err) {
        next(err);
    };
}

createPost = async (req, res, next) => {
    const { errors } = validationResult(req);
    if (errors.length > 0) {
        const error = new Error('Validation Failed!');
        error.status = 422;
        error.data = errors;
        throw error;
    }

    if (!req.file) {
        const error = new Error('No image!');
        error.status = 422;
        throw error;
    }

    const { title, content } = req.body;
    const imageUrl = req.file.path.replace(/\\/g, '/');
    const post = new PostModel({
        title,
        content,
        imageUrl,
        creator: req.userId
    });

    try {
        // Save to DB
        await post.save();
        const creator = await UserModel.findById(req.userId);
        creator.posts.push(post);
        await creator.save();

        // Return response
        res.status(201).json({
            message: "Post created!!!",
            post,
            creator: {
                _id: creator._id,
                name: creator.name
            }
        });
    } catch (err) {
        next(err);
    }
}

getPost = async (req, res, next) => {
    const { postId } = req.params;
    try {
        const post = await PostModel.findById(postId).lean();
        if (!post) {
            const error = new Error('Post not found!');
            error.status = 404;
            throw error;
        }

        res.status(200).json({
            message: 'Post fetched.',
            post
        });
    } catch (err) {
        next(err);
    }
}

updatePost = async (req, res, next) => {
    const { postId } = req.params;
    const { errors } = validationResult(req);
    if (errors.length > 0) {
        const error = new Error('Validation Failed!');
        error.status = 422;
        error.data = errors;
        throw error;
    }

    let { title, content, image: imageUrl } = req.body;
    if (req.file) {
        imageUrl = req.file.path;
    }
    if (!imageUrl) {
        const error = new Error('No image!');
        error.status = 422;
        throw error;
    }

    try {
        const post = await PostModel.findById(postId);
        if (!post) {
            const error = new Error('Post not found!');
            error.status = 404;
            throw error;
        }

        if (post.creator.toString() !== req.userId) {
            const error = new Error('Not authorized!');
            error.status = 403;
            throw error;
        }

        if (imageUrl !== post.imageUrl) {
            clearImage(post.imageUrl);
        }

        post.title = title;
        post.imageUrl = imageUrl.replace(/\\/g, '/');
        post.content = content;
        const result = await post.save();

        // Return response
        res.status(200).json({
            message: 'Post updated!',
            post: result
        });
    } catch (err) {
        next(err);
    }
}

deletePost = async (req, res, next) => {
    const { postId } = req.params;
    try {
        const post = await PostModel.findById(postId)
        if (!post) {
            const error = new Error('Post not found');
            error.status = 404;
            throw error;
        }

        if (post.creator.toString() !== req.userId) {
            const error = new Error('Not authorized!');
            error.status = 403;
            throw error;
        }

        // Check logged in user
        clearImage(post.imageUrl);
        await PostModel.findByIdAndRemove(postId);
        const user = await UserModel.findById(req.userId)
        user.posts.pull(postId);
        await user.save();

        res.status(200).json({
            message: 'Deleted successfully'
        });
    } catch (err) {
        next(err);
    }
}

// Remove image in system
const clearImage = filePath => {
    filePath = path.join(__dirname, '..', filePath);
    fs.unlink(filePath, err => console.log(err));
}

module.exports = {
    getPosts,
    createPost,
    getPost,
    updatePost,
    deletePost
}