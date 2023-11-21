function errorHandler(err, req, res, next) {
  if (err.name === "UnauthorizedError") {
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized access" });
  }

  return res.status(500).json({ message: err.name });
}

module.exports = errorHandler;
