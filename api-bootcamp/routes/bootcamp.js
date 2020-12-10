const express = require('express');
const router = express.Router();

const {
    getBootcamps,
    getBootcamp,
    createBootcamp,
    editBootcamp,
    deleteBootcamp
} = require('./../controllers/bootcamp');
const asyncHandler = require('./../middlewares/async');

//
// router.get('/', asyncHandler(getBootcamps));

router.route('/')
    .get(asyncHandler(getBootcamps))
    .post(asyncHandler(createBootcamp));

router.route('/:id')
    .get(asyncHandler(getBootcamp))
    .put(asyncHandler(editBootcamp))
    .delete(asyncHandler(deleteBootcamp));

module.exports = router;