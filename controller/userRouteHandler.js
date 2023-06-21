// eslint-disable-next-line import/no-extraneous-dependencies
const jwt = require('jsonwebtoken');
const Users = require('../models/userModel');
const AppError = require('../utils/appError');
const { promisify } = require('util');
const { DBerrorDeliver } = require('./globalErrorHandler');
const mail = require('../mail');
module.exports.userSingup = DBerrorDeliver(async (req, res, next) => {
  // console.log(req);

  await Users.create({
    // 只接受需要的数据
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    lastLogin: new Date(),
  });
  const user = await Users.findOne({ email: req.email });
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
});

module.exports.userLogin = DBerrorDeliver(async (req, res, next) => {
  const { email, password } = req.body;
  console.log('userlogin');
  if (!email || !password) {
    return next(new AppError('账号或密码不能为空', 400, true));
  }
  const user = await Users.findOne({ email: email }).select('+password');
  if (user && (await user.loginConfirm(password, user.password))) {
    let lastLogin = new Date();
    const user = await Users.findOneAndUpdate(
      { email },
      { lastLogin },
      {
        new: true,
      }
    );

    console.log('😄用户存在lastLogin===>', lastLogin);
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
      data: user,
    });
  } else {
    throw new AppError('密码或账号错误,请重新输入或者修改密码', 400, true);
  }
});
// 验证
module.exports.authorization = DBerrorDeliver(async (req, res, next) => {
  // 1存在token
  let token = req.headers.authorization;
  if (!token || !token.startsWith('Bearer')) {
    throw new AppError('请先登录', 401, true);
  } else {
    token = token.split(' ')[1];
    const { id, time } = await promisify(jwt.verify)(
      token,
      process.env.JWT_SECRET
    );
    let user = await Users.findById(id);
    console.log('⏲验证');
    if (Date.parse(user.lastLogin) === Date.parse(time)) {
      req.user = user;
      // 执行后面路由
      next();
    } else {
      throw new AppError('你已在其他设备登录,是否本人登陆', 401, true);
    }
  }
});
module.exports.test = (req, res) => {
  console.log('TEST router执行');
  res.status(200).json({
    status: 'success',
    message: '',
    // })
  });
};

module.exports.forget = DBerrorDeliver(async (req, res, next) => {
  // 验证邮箱和姓名

  const user = await Users.findOne({
    email: req.body.email,
  });
  if (user) {
    // const { mailRes, authNum } = await mail(req.body.email);

    // if (mailsent.response.startsWith('250')) {
    res.status(200).json({
      status: 'success',
      message: '验证码发送成功',
    });
    // });
    // } else {
    // throw new AppError('验证邮件发从失败', 404, false);
    // }
  } else {
    throw new AppError('请输入正确邮件地址', 404, true);
  }
});
module;
