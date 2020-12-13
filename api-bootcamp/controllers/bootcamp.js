const geocoder = require('./../utils/geocoder');

const CustomError = require('../utils/customError');
const BootcampModel = require('./../models/Bootcamp');

//  @desc   Get all bootcamps
//  @route  GET /api/v1/bootcamps
//  @access Public
exports.getBootcamps = async (req, res, next) => {
    // Return response
    res.status(200).json(res.advancedResults);
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
    const bootcamp = await BootcampModel.findById(req.params.id);
    if (!bootcamp) {
        throw new CustomError('Bootcamp not found!', 404);
    }

    await bootcamp.remove();
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

//  @desc   Upload photo for bootcmap
//  @route  PUT /api/v1/bootcamps/:id/photo
//  @access Private
exports.bootcampPhotoUpload = async (req, res, next) => {
    const { id } = req.params;
    const bootcamp = await BootcampModel.findById(id).select('_id').lean();
    if (!bootcamp) {
        throw new CustomError('Bootcamp not found!', 404);
    }

    if (!req.files) {
        throw new CustomError('Please upload a file!', 400);
    }

    const { file } = req.files;
    // Check file is a photo only
    if (!file.mimetype.startsWith('image')) {
        throw new CustomError('Image type only!', 400);
    }

    // Check file size
    if (file.size > process.env.MAX_FILE_UPLOAD) {
        throw new CustomError(`Image size must be less than ${process.env.MAX_FILE_UPLOAD}!`, 400);
    }

    // Create custom file name
    file.name = `photo_${bootcamp._id}.${file.name.split('.')[1]}`;

    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
        if (err) {
            console.log(err);
            throw new CustomError('Problem with file upload!', 500);
        }

        await BootcampModel.findByIdAndUpdate(id, { photo: file.name });

        res.status(200).json({
            success: true,
            data: file.name
        });
    });

    console.log(file.name);
} 