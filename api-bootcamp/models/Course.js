const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: [true, 'Please add title!']
    },
    description: {
        type: String,
        required: [true, 'Please add description!']
    },
    weeks: {
        type: String,
        required: [true, 'Please add number of weeks!']
    },
    weeks: {
        type: String,
        required: [true, 'Please add number of weeks!']
    },
    tuition: {
        type: Number,
        required: [true, 'Please add a tuition cost!']
    },
    minimumSkill: {
        type: String,
        required: [true, 'Please add a minimum skill!'],
        enum: ['beginner', 'intermediate', 'advanced']
    },
    scholarshipAvailable: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    bootcamp: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Bootcamp',
        required: true
    }
});

module.exports = mongoose.model('Course', CourseSchema);