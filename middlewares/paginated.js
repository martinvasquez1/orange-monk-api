const asyncHandler = require('express-async-handler');

function paginated(model) {
  return asyncHandler(async (req, res, next) => {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const results = {};

    const amountDocuments = await model.countDocuments().exec();
    if (endIndex < amountDocuments) {
      results.next = {
        page: page + 1,
        limit: limit,
      };
    }

    if (startIndex > 0) {
      results.previous = {
        page: page - 1,
        limit: limit,
      };
    }

    results.results = await model.find().limit(limit).skip(startIndex).exec();
    res.paginated = results;
    next();
  });
}

module.exports = {
  paginated,
};
