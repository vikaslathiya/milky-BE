// The global error handler is used catch all errors and remove the need for redundant
// error handler code throughout the application. It's configured as middleware in
// the main server.js file.

module.exports = errorHandler;

function errorHandler(err, req, res, next) {
  if (typeof err === "string") {
    // custom application error
    return res.status(400).json({ message: err });
  }

  if (err.name === "validationError") {
    // mongoose validation error
    return res.status(400).json({ message: err.message });
  }

  if (err.name === "UnauthorizedError") {
    // jwt authentication error
    return res.status(401).json({ message: "Invalid Token" });
  }

  // default to 500 server error
  return res.status(500).json({ message: err.message });
}
