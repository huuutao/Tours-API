module.exports = class AppError extends Error {
  constructor(ErrMessage, statusCode, operation) {
    super(ErrMessage);
    this.statusCode = statusCode;
    this.operation = operation;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    Error.captureStackTrace(this, this.constructor);
  }

  static creatErr(err) {
    let rawMsg = '';
    switch (err.name) {
      case 'CastError':
        rawMsg = `${err.value}是无效路径`;
        return new AppError(rawMsg, 401, true);
      case 'ValidationError':
        const val = Object.keys(err.errors).join(',');
        rawMsg = `${val}是无效值`;
        return new AppError(rawMsg, 400, true);
      case 'TokenExpiredError':
        return new AppError('登陆已过期,请重新登陆', 400, true);
      case 'MongoServerError':
        return new AppError('该用户名已存在', 400, true);
      default:
        return err;
    }
  }
};
