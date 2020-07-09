const User = require('../models/user');

const validator = require('express-validator');
const async = require('async');

exports.index = (req, res) => {
	res.render('index', { title: 'Lord' });
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
	validator.sanitizeBody('*').escape(),
	(req, res, next) => {
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
				password: req.body.password,
			});

			user.save((err) => {
				if (err) {
					return next(err);
				}
				res.redirect('/');
			});
		}
	},
];
