const CustomError = require('../utils/customError');
const CourseModel = require('./../models/Course');

//  @desc   Get all courses
//  @route  GET /api/v1/courses
//  @route  GET /api/v1/bootcamps/:bootcampId/courses
//  @access Public
exports.getCoures = async (req, res, next) => {
    const { bootcampId } = req.params;
    const condition = bootcampId ? { bootcamp: bootcampId } : {};
    const query = CourseModel.find(condition);
    const courses = await query.lean();

    // Return response
    res.status(200).json({
        success: true,
        count: courses.length,
        data: courses
    });
};