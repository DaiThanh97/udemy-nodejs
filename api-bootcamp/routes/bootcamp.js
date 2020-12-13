const express = require('express');
const router = express.Router();

const { protect } = require('./../middlewares/auth');
const BootcampModel = require('./../models/Bootcamp');
const advancedResults = require('./../middlewares/advancedResults');
const courseRouter = require('./course');
const {
    getBootcamps,
    getBootcamp,
    createBootcamp,
    editBootcamp,
    deleteBootcamp,
    getBootcampsInRadius,
    bootcampPhotoUpload
} = require('./../controllers/bootcamp');

// Re-route to other resources
router.use('/:bootcampId/courses', courseRouter);

router.route('/')
    .get(advancedResults(BootcampModel, 'courses'), getBootcamps)
    .post(protect, createBootcamp);

router.route('/:id')
    .get(getBootcamp)
    .put(protect, editBootcamp)
    .delete(protect, deleteBootcamp);

router.route('/:id/photo')
    .put(protect, bootcampPhotoUpload);

// Find all bootcamp within the distance
router.get('/radius/:zipcode/:distance', getBootcampsInRadius);

module.exports = router;