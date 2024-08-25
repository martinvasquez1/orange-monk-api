const { body } = require('express-validator');
const { handleValidationError } = require('../errorHandlers');

exports.validateSignUp = [
  body('username')
    .trim()
    .isLength({ min: 3, max: 32 })
    .withMessage('Username must be between 3 and 32 characters.')
    .escape(),
  body('email')
    .trim()
    .isEmail()
    .withMessage('Invalid email.')
    .isLength({ min: 5, max: 256 })
    .withMessage('Email must be between 5 and 256 characters.')
    .escape(),
  body('password')
    .isLength({ min: 3, max: 512 })
    .withMessage('Password must be between 3 and 512 characters.')
    .escape(),
  body('confirmPassword')
    .custom((value, { req }) => value === req.body.password)
    .withMessage('Passwords must match.')
    .escape(),
  handleValidationError,
];

exports.validateSignIn = [
  body('email').trim().isEmail().withMessage('Invalid email.').escape(),
  body('password').escape(),
  handleValidationError,
];

exports.validateUpdate = [
  body('username')
    .trim()
    .isLength({ min: 3, max: 32 })
    .withMessage('Username must be between 3 and 32 characters.')
    .escape()
    .optional(),
  body('email')
    .trim()
    .isEmail()
    .withMessage('Invalid email.')
    .isLength({ min: 5, max: 256 })
    .withMessage('Email must be between 5 and 256 characters.')
    .escape()
    .optional(),
  body('password')
    .isLength({ min: 3, max: 512 })
    .withMessage('Password must be between 3 and 512 characters.')
    .escape()
    .optional(),
  handleValidationError,
];
