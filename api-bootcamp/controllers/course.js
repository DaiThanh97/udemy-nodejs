const CustomError = require('../utils/customError');
const CourseModel = require('./../models/Course');
const BootcampModel = require('./../models/Bootcamp');
const asyncHandler = require('./../middlewares/async');

//  @desc   Get all courses
//  @route  GET /api/v1/courses
//  @route  GET /api/v1/bootcamps/:bootcampId/courses
//  @access Public
exports.getCourses = asyncHandler(async (req, res, next) => {
    const { bootcampId } = req.params;

    if (bootcampId) {
        const courses = await CourseModel.find(condition).lean();
        return res.status(200).json({
            success: true,
            count: courses.length,
            data: courses
        });
    }
    else {
        res.status(200).json(res.advancedResults);
    }
});

//  @desc   Get single course
//  @route  GET /api/v1/courses/:id
//  @access Public
exports.getCourse = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const course = await CourseModel.findById(id).populate({ path: 'bootcamp', select: 'name description' }).lean();
    if (!course) {
        throw new CustomError('No course found!', 404);
    }

    // Return response
    res.status(200).json({
        success: true,
        data: course
    });
});

//  @desc   Add a course
//  @route  POST /api/v1/bootcamps/:bootcampId/courses
//  @access Private
exports.addCourse = asyncHandler(async (req, res, next) => {
    const { bootcampId } = req.params;
    const { title } = req.body;
    req.body.bootcamp = bootcampId;

    const bootcamp = await BootcampModel.findById(bootcampId).lean();
    if (!bootcamp) {
        throw new CustomError('No bootcamp found!', 404);
    }

    // Check exists title in courses within bootcamp
    const existedTitle = await CourseModel.findOne({ title }, 'title').lean();
    if (existedTitle) {
        throw new CustomError('Title in this bootcamp is already existed!', 400);
    }

    const course = await CourseModel.create(req.body);

    // Return response
    res.status(200).json({
        success: true,
        data: course
    });
});

//  @desc   Update course
//  @route  PUT /api/v1/courses/:id
//  @access Private
exports.updateCourse = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    let course = await CourseModel.findById(id).lean();
    if (!course) {
        throw new CustomError('No course found!', 404);
    }

    course = await CourseModel.findByIdAndUpdate(id, req.body, { new: true, runValidators: true }).lean();

    // Return response
    res.status(200).json({
        success: true,
        data: course
    });
});

//  @desc   Delete course
//  @route  DELETE /api/v1/courses/:id
//  @access Private
exports.deleteCourse = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const course = await CourseModel.findById(id);
    if (!course) {
        throw new CustomError('No course found!', 404);
    }

    await course.remove();

    // Return response
    res.status(200).json({
        success: true,
        data: {}
    });
});