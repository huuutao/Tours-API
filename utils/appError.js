module.exports = class AppError extends Error {
  constructor(ErrMessage, statusCode, operation) {
    super(ErrMessage);
    this.statusCode = statusCode;
    this.operation = operation;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    Error.captureStackTrace(this, this.constructor);
  }

  static creatErr(err) {
    if (err.name === 'CastError') {
      const rawMsg = `${err.value}是无效路径`;
      return new AppError(rawMsg, 401, true);
    }
    if (err.name === 'ValidationError') {
      const val = Object.keys(err.errors).join(',');
      const rawMsg = `${val}是无效值`;
      return new AppError(rawMsg, 400, true);
    }
    if (err.code === 11000) {
      const rawMsg = `${Object.keys(err.keyValue).join(' ')}重复`;
      return new AppError(rawMsg, 400, true);
    }
    return new AppError('SERVER ERROR', 500, false);
  }
};
