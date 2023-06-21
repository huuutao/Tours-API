const nodemailer = require('nodemailer');

const transport = nodemailer.createTransport({
  host: 'sandbox.smtp.mailtrap.io',
  port: 2525,
  auth: {
    user: '4d44422afe122a',
    pass: '095dc67ff4eb4e',
  },
});
transport.verify(function (error, success) {
  if (error) {
    console.log('denglushibai', error.message);
  } else {
    console.log('Server is ready to take our messages');
  }
});

// random
// let timer;
const mail = async (req) => {
  const random = String(Math.floor(Math.random() * 10000)).padEnd(4);
  let mailad = [];
  if (!timer) {
    timer = setTimeout(() => {
      mailad.shift();
    }, 30000);
  }
  const mail = {
    name: 'ceshi',
    from: 'godferyevans@qq.com', // 发件人
    subject: 'suiji', //邮箱主题
    to: req.body.mail, //收件人，这里由post请求传递过来

    // 邮件内容，用html格式编写
    // text: 'Plaintext version of the message',
    html: `
        <p>您好！</p>
        <p>修改密码:<a style="color:orangered;">${{req.protocol}}://${req.url.}</a></p>
        <p>如果不是您本人操作，请无视此邮件</p>
    `,
  };
  let info;
  if (!mailad.includes(address)) {
    info = await mailsender.sendMail(mail);
    console.log('chenggongfasong');
    mailad.push(address);
  }
  return { mailRes: info.response, authNum: random };
};

// mail('chris7ina1096@gmail.com');
// mail('chris7ina1096@gmail.com');
// mail('chris7ina1096@gmail.com');
// mail('chris7ina1096@gmail.com');

