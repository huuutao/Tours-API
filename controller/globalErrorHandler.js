const AppError = require('../utils/appError');

// error deliver 传递路由handler的Db错误
module.exports.DBerrorDeliver = (fn) => (req, res, next) => {
  fn(req, res, next).catch(next);
};

function devErrorsHandler(err, res) {
  // console.log(err);
  // res.status(404).json({
  //   message: err,
  // });
  // 临时

  if (err.operation === true) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    res.status(err.statusCode).json({
      status: err.status,
      message: 'SERVER ERROR',
    });
  }
}

function proErrorsHandler(err, res) {
  if (err.operation === true) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }
}

module.exports.unexpectUrlErrorHandler = (err, req, res, next) => {
  // err.statusCode = err.statusCode || 500;
  // err.status = err.status || 'server error';
  // res.status(200).json({
  //   status: err.status,
  //   message: err,
  // });
  const globalERR = err instanceof AppError ? err : AppError.creatErr(err);
  if (process.env.NODE_ENV === 'development') {
    devErrorsHandler(globalERR, res);
  } else if (process.env.NODE_ENV === 'production') {
    proErrorsHandler(globalERR, res);
  }
};
