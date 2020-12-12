const express = require('express');
const router = express.Router({ mergeParams: true });

const asyncHandler = require('./../middlewares/async');
const {
    getCourses,
    getCourse,
    addCourse
} = require('./../controllers/course');

router.route('/')
    .get(asyncHandler(getCourses))
    .post(asyncHandler(addCourse));

router.get('/:id', asyncHandler(getCourse));

module.exports = router;