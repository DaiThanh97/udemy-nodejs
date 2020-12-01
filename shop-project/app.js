// Core modules
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

// 3th Party
require('dotenv').config();
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');

// Define Self
const shopRouter = require('./routes/shop');
const adminRouter = require('./routes/admin');
const authRouter = require('./routes/auth');
const configs = require('./configs/db');
const UserModel = require('./models/user');

const app = express();

// Connect Database
mongoose.connect(configs.DB_CONNECT_STR,
	{
		useNewUrlParser: true,
		useUnifiedTopology: true
	},
	(err) => {
		if (err) {
			console.log("Connect DB Failed: ", err);
		}
	});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Config express layout
app.use(expressLayouts);
app.set('layout', 'layout');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// Init session middleware
app.use(session({
	secret: process.env.SESSION_SECRET_KEY,
	resave: false,
	saveUninitialized: false,
	store: new MongoDBStore({
		uri: configs.DB_CONNECT_STR,
		collection: 'sessions',
	}),
}));
// Init csrf middleware
app.use(csrf());
// Init flash middleware
app.use(flash());

app.use((req, res, next) => {
	res.locals.isAuthenticated = req.session.isLoggedIn;
	res.locals.csrfToken = req.csrfToken();
	next();
})

app.use((req, res, next) => {
	if (!req.session.user) {
		return next();
	}
	UserModel.findById(req.session.user._id)
		.then(user => {
			req.user = user;
			next();
		})
		.catch(err => console.log(err));
})

// Backend admin
app.use('/admin', adminRouter);
// Frontend shop
app.use(shopRouter);
// Authen
app.use(authRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error', { title: "", path: '/error' });
});

module.exports = app;
