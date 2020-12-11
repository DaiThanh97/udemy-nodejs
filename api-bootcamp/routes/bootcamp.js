const express = require('express');
const router = express.Router();

const asyncHandler = require('./../middlewares/async');
const {
    getBootcamps,
    getBootcamp,
    createBootcamp,
    editBootcamp,
    deleteBootcamp,
    getBootcampsInRadius
} = require('./../controllers/bootcamp');
const courseRouter = require('./course');

// Re-route to other resources
router.use('/:bootcampId/courses', courseRouter);

router.route('/')
    .get(asyncHandler(getBootcamps))
    .post(asyncHandler(createBootcamp));

router.route('/:id')
    .get(asyncHandler(getBootcamp))
    .put(asyncHandler(editBootcamp))
    .delete(asyncHandler(deleteBootcamp));

// Find all bootcamp within the distance
router.get('/radius/:zipcode/:distance', asyncHandler(getBootcampsInRadius));

module.exports = router;