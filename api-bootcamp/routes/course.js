const express = require('express');
const router = express.Router({ mergeParams: true });

const asyncHandler = require('./../middlewares/async');
const {
    getCoures
} = require('./../controllers/course');

router.get('/', asyncHandler(getCoures));

module.exports = router;