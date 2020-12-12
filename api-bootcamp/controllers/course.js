const CustomError = require('../utils/customError');
const CourseModel = require('./../models/Course');
const BootcampModel = require('./../models/Bootcamp');

//  @desc   Get all courses
//  @route  GET /api/v1/courses
//  @route  GET /api/v1/bootcamps/:bootcampId/courses
//  @access Public
exports.getCourses = async (req, res, next) => {
    const { bootcampId } = req.params;
    const condition = bootcampId ? { bootcamp: bootcampId } : {};
    const query = CourseModel.find(condition).populate({ path: 'bootcamp', select: 'name description' }).lean();
    const courses = await query.lean();

    // Return response
    res.status(200).json({
        success: true,
        count: courses.length,
        data: courses
    });
};

//  @desc   Get single course
//  @route  GET /api/v1/courses/:id
//  @access Public
exports.getCourse = async (req, res, next) => {
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
};

//  @desc   Add a course
//  @route  POST /api/v1/bootcamps/:bootcampId/courses
//  @access Private
exports.addCourse = async (req, res, next) => {
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
};