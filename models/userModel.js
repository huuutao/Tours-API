const mongoose = require('mongoose');
const validator = require('validator');
// eslint-disable-next-line import/no-extraneous-dependencies
const bcrypt = require('bcrypt');

const user = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'need a name'],
    trim: true,
    validate: {
      validator(val) {
        return val === val.match(/\w+/)[0];
      },
      message: 'nihao',
    },
  },

  email: {
    type: String,
    unique: [true, 'the email is being used'],
    required: [true, 'need a emil'],
    trim: true,
    validate: [validator.isEmail, 'need a valid email'],
  },
  photo: String,
  password: {
    type: String,
    required: [true, 'need a password'],
    minlength: 8,
    maxlength: 16,
    select: false,
  },
  // 只在创建密码时验证,update时无效
  passwordConfirm: {
    type: String,
    required: true,
    validate: function (val) {
      return val === this.password;
    },
    message: 'password is not same',
  },
  lastLogin: {
    type: Date,
    default: Date.now(),
  },
});
user.methods.loginConfirm = async function (currentPassword, password) {
  return await bcrypt.compare(currentPassword, password);
};

user.pre('save', async function (next) {
  if (!this.isModified('password')) return next(); //未修改密码时不再次加密
  this.password = await bcrypt.hash(this.password, 12); //加密
  this.passwordConfirm = undefined; //数据库删除二次确认
  next();
});

module.exports = mongoose.model('User', user);
