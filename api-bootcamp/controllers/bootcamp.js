const CustomError = require('../utils/customError');
const BootcampModel = require('./../models/Bootcamp');

//  @desc   Get all bootcamps
//  @route  GET /api/v1/bootcamps
//  @access Public
exports.getBootcamps = async (req, res, next) => {
    const bootcamps = await BootcampModel.find();
    res.status(200).json({
        success: true,
        count: bootcamps.length,
        data: bootcamps
    });
}

//  @desc   Get single bootcamp
//  @route  GET /api/v1/bootcamps/:id
//  @access Public
exports.getBootcamp = async (req, res, next) => {
    const bootcamp = await BootcampModel.findById(req.params.id);
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
    const bootcamp = await BootcampModel.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
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