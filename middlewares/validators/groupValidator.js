const { body } = require('express-validator');
const { handleValidationError } = require('../errorHandlers');

exports.validateGroupCreation = [
  body('name')
    .trim()
    .isLength({ min: 1, max: 32 })
    .withMessage('Name must be between 1 and 32 characters.')
    .escape(),
  body('description')
    .trim()
    .isLength({ min: 1, max: 256 })
    .withMessage('Description must be between 1 and 256 characters.')
    .escape(),
  handleValidationError,
];

exports.validateGroupUpdate = [
  body('name')
    .trim()
    .isLength({ min: 1, max: 32 })
    .withMessage('Name must be between 1 and 32 characters.')
    .escape(),
  body('description')
    .trim()
    .isLength({ min: 1, max: 256 })
    .withMessage('Description must be between 1 and 256 characters.')
    .escape(),
  body('sidebar')
    .trim()
    .isLength({ min: 0, max: 256 })
    .withMessage('Sidebar must be between 0 and 256 characters.')
    .escape(),
  handleValidationError,
];
