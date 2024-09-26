const { validationResult } = require('express-validator');

const handleValidationError = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      status: 'fail',
      data: { errors: errors.array() },
    });
    return;
  }
  next();
};

const handleNotFoundError = (req, res, resourceName) => {
  return res.status(404).json({
    status: 'fail',
    data: { message: `${resourceName} does not exist.` },
  });
};

module.exports = {
  handleValidationError,
  handleNotFoundError,
};
