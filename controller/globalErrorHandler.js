const AppError = require('../utils/appError');

// error deliver 传递路由handler的Db错误
module.exports.DBerrorDeliver = (fn) => (req, res, next) => {
  fn(req, res, next).catch(next);
};

function devErrorsHandler(err, res) {
  if (err.operation === true) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      stack: err.stack,
    });
  } else {
    console.log(err);
    res.status(500).json({
      err: err,
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
  console.log('👩‍🏭Global Error Handler');
  const globalERR = err instanceof AppError ? err : AppError.creatErr(err);
  if (process.env.NODE_ENV === 'development') {
    devErrorsHandler(globalERR, res);
  } else if (process.env.NODE_ENV === 'production') {
    proErrorsHandler(globalERR, res);
  }
};
