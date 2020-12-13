const express = require('express');
const router = express.Router();

const asyncHandler = require('./../middlewares/async');
const BootcampModel = require('./../models/Bootcamp');
const advancedResults = require('./../middlewares/advancedResults');
const {
    getBootcamps,
    getBootcamp,
    createBootcamp,
    editBootcamp,
    deleteBootcamp,
    getBootcampsInRadius,
    bootcampPhotoUpload
} = require('./../controllers/bootcamp');
const courseRouter = require('./course');

// Re-route to other resources
router.use('/:bootcampId/courses', courseRouter);

router.route('/')
    .get(asyncHandler(advancedResults(BootcampModel, 'courses')), asyncHandler(getBootcamps))
    .post(asyncHandler(createBootcamp));

router.route('/:id')
    .get(asyncHandler(getBootcamp))
    .put(asyncHandler(editBootcamp))
    .delete(asyncHandler(deleteBootcamp));

router.route('/:id/photo')
    .put(asyncHandler(bootcampPhotoUpload));

// Find all bootcamp within the distance
router.get('/radius/:zipcode/:distance', asyncHandler(getBootcampsInRadius));

module.exports = router;