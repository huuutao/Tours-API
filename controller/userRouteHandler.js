// eslint-disable-next-line import/no-extraneous-dependencies
const jwt = require('jsonwebtoken');
const Users = require('../models/userModel');

module.exports.userSingup = async (req, res, next) => {
  // console.log(req);
  try {
    const user = await Users.create({
      // 只接受需要的数据
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
    });
    const token = jwt.sign(
      // eslint-disable-next-line no-underscore-dangle
      { id: user._id },
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
    res.status(200).json({
      message: err,
    });
  }
};
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
  }
};
