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

// 
CourseSchema.statics.getAverageCost = async function (bootcampId) {
    const obj = await this.aggregate([
        {
            $match: { bootcamp: bootcampId }
        },
        {
            $group: {
                _id: '$bootcamp',
                averageCost: { $avg: '$tuition' }
            }
        }
    ]);

    try {
        await this.model('Bootcamp').findByIdAndUpdate(bootcampId, {
            averageCost: obj.length > 0 ? Math.ceil(obj[0].averageCost) : 0
        });
    } catch (err) {
        console.log(err);
    }
};

// Call getAverageCost after save
CourseSchema.post('save', function () {
    this.constructor.getAverageCost(this.bootcamp);
});

// Call getAverageCost after remove
CourseSchema.post('remove', function () {
    this.constructor.getAverageCost(this.bootcamp);
});


module.exports = mongoose.model('Course', CourseSchema);