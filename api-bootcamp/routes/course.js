const express = require('express');
const router = express.Router({ mergeParams: true });

const { protect } = require('./../middlewares/auth');
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
        advancedResults(CourseModel, { path: 'bootcamp', select: 'name description' }),
        getCourses
    )
    .post(protect, addCourse);

router.route('/:id')
    .get(getCourse)
    .put(protect, updateCourse)
    .delete(protect, deleteCourse);

module.exports = router;