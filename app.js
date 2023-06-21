const path = require('path');
const express = require('express');
const morgan = require('morgan');
const tourRouter = require('./routes/toursRoutes');
const userRouter = require('./routes/usersRoutes');
const AppError = require('./utils/appError');
const { unexpectUrlErrorHandler } = require('./controller/globalErrorHandler');

const app = express();
// middleware
app.use(express.json());

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}
// static resources
app.use(express.static(path.resolve(__dirname, './public')));
// router
app.use('/api/v1/tours', tourRouter);
app.use('/user', userRouter);
app.all('*', (req, res, next) => {
  console.log('global error handler');
  const err = new AppError('资源请求失败', 404, true);
  next(err);
});

app.use(unexpectUrlErrorHandler); //放在路由之后
module.exports = app;
