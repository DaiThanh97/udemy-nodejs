const express = require('express');
const router = express.Router({ mergeParams: true });

const asyncHandler = require('./../middlewares/async');
const CourseModel = require('./../models/Course');
const advancedResults = require('./../middlewares/advancedResults');
const {
    getCourses,
    getCourse,
    addCourse,
    updateCourse,
    deleteCourse
} = require('./../controllers/course');

router.route('/')
    .get(
        asyncHandler(advancedResults(CourseModel, { path: 'bootcamp', select: 'name description' })),
        asyncHandler(getCourses)
    )
    .post(asyncHandler(addCourse));

router.route('/:id')
    .get(asyncHandler(getCourse))
    .put(asyncHandler(updateCourse))
    .delete(asyncHandler(deleteCourse));

module.exports = router;