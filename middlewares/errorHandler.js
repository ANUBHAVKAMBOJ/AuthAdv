const errorHandler = (err, req, res, next) => {
  // Determine if the response status code has been set, default to 500 if not
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode);

  // Send response with error message and stack trace (if not in production)
  res.json({
    status: "error",
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? "" : err.stack,
  });
};

module.exports = errorHandler;
