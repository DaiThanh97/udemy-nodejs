require('dotenv').config();
const fs = require('fs');
const mongoose = require('mongoose');

const BootcampModel = require('./models/Bootcamp');
const CourseModel = require('./models/Course');
const UserModel = require('./models/User');

// Connect to DB
const connectDB = async () => await mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
});
connectDB();
console.log("Connected to DB");

// Read JSON file
const bootcamps = JSON.parse(fs.readFileSync('./mocks/bootcamps.json', { encoding: 'utf-8' }));
const courses = JSON.parse(fs.readFileSync('./mocks/courses.json', { encoding: 'utf-8' }));
const users = JSON.parse(fs.readFileSync('./mocks/users.json', { encoding: 'utf-8' }));

// Import into DB
const importData = async () => {
    try {
        await Promise.all([
            BootcampModel.create(bootcamps),
            CourseModel.create(courses),
            UserModel.create(users),
        ]);
        console.log("Data Imported!");
        process.exit();
    } catch (err) {
        console.log(err);
    }
};

// Delete data 
const deleteData = async () => {
    try {
        await Promise.all([
            BootcampModel.deleteMany(),
            CourseModel.deleteMany(),
            UserModel.deleteMany()
        ]);
        console.log("Data Deleted!");
        process.exit();
    } catch (err) {
        console.log(err);
    }
};

if (process.argv[2] === '-i') {
    importData();
}
else if (process.argv[2] === '-d') {
    deleteData();
}