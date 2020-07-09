const User = require('../models/user');
const passport = require('passport');
const bcrypt = require('bcryptjs');

const validator = require('express-validator');
const async = require('async');

exports.index = (req, res) => {
	res.render('index', { title: 'Lord', user: req.user });
};

exports.sign_up_get = (req, res, next) => {
	res.render('sign_up_form', { title: 'Sign Up' });
};

exports.sign_up_post = [
	validator
		.body('first_name')
		.isLength({ min: 1 })
		.trim()
		.withMessage('First name must be specified')
		.isAlphanumeric()
		.withMessage('First name has non-alphanumeric characters.'),
	validator
		.body('last_name')
		.isLength({ min: 1 })
		.trim()
		.withMessage('First name must be specified')
		.isAlphanumeric()
		.withMessage('First name has non-alphanumeric characters.'),
	validator
		.body('email')
		.isEmail()
		.trim()
		.withMessage('Must enter a valid email address'),
	validator
		.body('password')
		.isLength({ min: 5 })
		.withMessage('Password must be 5 atleast characters long'),
	validator
		.body('confirmpassword')
		.exists()
		.custom((value, { req }) => value === req.body.password)
		.withMessage('its not the same man'),

	// Indicates the success of this synchronous custom validator
	validator.body('*').escape(),
	(req, res, next) => {
		bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
			const errors = validator.validationResult(req);

			if (!errors.isEmpty()) {
				//there are errors
				res.render('sign_up_form', {
					title: 'Sign Up',
					user: req.body,
					errors: errors.array(),
				});
			} else {
				//form is valid bro

				const user = new User({
					first_name: req.body.first_name,
					last_name: req.body.last_name,
					email: req.body.email,
					password: hashedPassword,
				});

				user.save((err) => {
					if (err) {
						return next(err);
					}
					res.redirect('/');
				});
			}
		});
	},
];

exports.log_in_get = (req, res, next) => {
	res.render('log_in', { title: 'Login', msg: req.flash('error')[0] });
};

exports.log_in_post = [
	validator.body('email').trim(),
	passport.authenticate('local', {
		successRedirect: '/',
		failureRedirect: '/log-in',
		failureFlash: true,
		failureFlash: 'Invalid username or password.',
	}),
];

exports.log_out_get = (req, res) => {
	req.logout();
	res.redirect('/');
};
