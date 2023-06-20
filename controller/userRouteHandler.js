// eslint-disable-next-line import/no-extraneous-dependencies
const jwt = require('jsonwebtoken');
const Users = require('../models/userModel');
const AppError = require('../utils/appError');
const { promisify } = require('util');
const { DBerrorDeliver } = require('./globalErrorHandler');
const assert = require('assert');
module.exports.userSingup = async (req, res, next) => {
  // console.log(req);
  try {
    const user = await Users.create({
      // 只接受需要的数据
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
      lastLogin: new Date(),
    });
    const token = jwt.sign(
      // eslint-disable-next-line no-underscore-dangle
      { id: user._id, time: new Date() },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRATION,
      }
    );
    console.log(token);
    res.status(200).json({
      status: 'success',
      token,
      data: user,
    });
  } catch (err) {
    next(err);
  }
};
module.exports.userLogin = DBerrorDeliver(async (req, res, next) => {
  const { email, password } = req.body;
  console.log('userlogin');
  if (!email || !password) {
    return next(new AppError('账号或密码不能为空', 400, true));
  }
  const user = await Users.findOne({ email: email }).select('+password');
  if (user && (await user.loginConfirm(password, user.password))) {
    let lastLogin = new Date();
    user.updateOne({ email });
    console.log('if user exite');
    const token = jwt.sign(
      // eslint-disable-next-line no-underscore-dangle
      { id: user._id, time: lastLogin },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRATION,
      }
    );
    res.status(200).json({
      status: 'success',
      token,
    });
  } else {
    throw new AppError('密码或账号错误,请重新输入或者修改密码', 400, true);
  }
});
// 验证
module.exports.authorization = async (req, res, next) => {
  // 1存在token
  const token = req.headers.authorization;
  if (!token) {
    return next(new AppError('请先登录', 401, true));
  }
  try {
    const { id, time } = await promisify(jwt.verify)(
      token,
      process.env.JWT_SECRET
    );
    const user = await Users.findById(id);
    console.log(time, user.lastLogin);
    // console.log(
    //   assert.equal(time.getTime(), user.lastLogin.getTime(), 'nihao')
    // );
    // if ((assert.equal(time,user.lastLogin))){
  } catch (err) {
    //   return next(new AppError('请先登录', 401, true));
    // }
    // if () {
    // 2.1 token --非法--
    // 2.2 token --自动过期-- --登录时间验证--  --
    next(err);
  }
};
module.exports.test = (req, res) => {
  res.status(200).json({
    status: 'success',
    message: '',
    // })
  });
};
