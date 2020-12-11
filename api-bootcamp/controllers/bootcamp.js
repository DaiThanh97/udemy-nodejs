const geocoder = require('./../utils/geocoder');

const CustomError = require('../utils/customError');
const BootcampModel = require('./../models/Bootcamp');

//  @desc   Get all bootcamps
//  @route  GET /api/v1/bootcamps
//  @access Public
exports.getBootcamps = async (req, res, next) => {
    let { select, sort, limit, page, ...reqQuery } = req.query;
    let queryStr = JSON.stringify(reqQuery);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, x => `$${x}`);

    // Not execute YET
    let query = BootcampModel.find(JSON.parse(queryStr));

    if (select) {
        select = select.replace(/,/g, ' ');
        query = query.select(select);
    }

    if (sort) {
        sort = sort.replace(/,/g, ' ');
        query = query.sort(sort);
    }
    else {
        query = query.sort('-createdAt');
    }

    // Pagination
    page = parseInt(page) || 1;
    const itemsPerPage = parseInt(limit) || 20;
    let startIndex = (page - 1) * itemsPerPage;
    let endIndex = page * itemsPerPage;
    const total = await BootcampModel.countDocuments();
    query = query.skip(startIndex).limit(itemsPerPage);

    // Execute the Query
    const bootcamps = await query.lean();

    // Pagination result
    const pagination = {};
    if (startIndex > 0) {
        pagination.prev = {
            page: page - 1,
            itemsPerPage
        }
    }
    if (endIndex < total) {
        pagination.next = {
            page: page + 1,
            itemsPerPage
        }
    }

    // Return response
    res.status(200).json({
        success: true,
        pagination,
        count: bootcamps.length,
        data: bootcamps
    });
}

//  @desc   Get single bootcamp
//  @route  GET /api/v1/bootcamps/:id
//  @access Public
exports.getBootcamp = async (req, res, next) => {
    const bootcamp = await BootcampModel.findById(req.params.id).lean();
    if (!bootcamp) {
        throw new CustomError('Bootcamp not found!', 404);
    }

    res.status(200).json({
        success: true,
        data: bootcamp
    });
}

//  @desc   Create bootcamp
//  @route  POST /api/v1/bootcamps
//  @access Public
exports.createBootcamp = async (req, res, next) => {
    const bootcamp = await BootcampModel.create(req.body);
    res.status(201).json({
        success: true,
        data: bootcamp
    });
}

//  @desc   Edit bootcamp
//  @route  PUT /api/v1/bootcamps/:id
//  @access Public
exports.editBootcamp = async (req, res, next) => {
    const bootcamp = await BootcampModel.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).lean();
    if (!bootcamp) {
        throw new CustomError('Update failed!', 400);
    }

    res.status(200).json({ success: true, data: bootcamp });
}

//  @desc   Delete bootcamp
//  @route  DELETE /api/v1/bootcamps/:id
//  @access Public
exports.deleteBootcamp = async (req, res, next) => {
    const bootcamp = await BootcampModel.findByIdAndDelete(req.params.id);
    if (!bootcamp) {
        throw new CustomError('Delete failed!', 400);
    }

    res.status(200).json({ success: true, data: {} });
}

//  @desc   Get bootcamps within a radius
//  @route  GET /api/v1/bootcamps/radius/:zipcode/:distance
//  @access Public
exports.getBootcampsInRadius = async (req, res, next) => {
    const { zipcode, distance } = req.params;

    // Get latitude / longitude from geocoder
    const located = await geocoder.geocode(zipcode);
    const latitude = located[0].latitude;
    const longitude = located[0].longitude;

    // Calc radius using radians
    // Divide distance by radius of Earth
    // Unit: miles
    const radius = distance / 3963;

    const bootcamps = await BootcampModel.find({
        location: {
            $geoWithin: {
                $centerSphere: [[longitude, latitude], radius]
            }
        }
    }).lean();

    res.status(200).json({
        success: true,
        count: bootcamps.length,
        data: bootcamps
    });
}