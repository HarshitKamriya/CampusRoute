const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found.',
  });
};

const errorHandler = (error, req, res, next) => {
  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal server error';

  if (statusCode >= 500) {
    console.error(error);
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
};

export { errorHandler, notFoundHandler };
