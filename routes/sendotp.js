const nodemailer = require('nodemailer');
const myemail='noreply.bankwebsite@gmail.com'
const mypass='lakmdvkwsbdtjukv'
// configure nodemailer transport
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: myemail,
    pass: mypass,
  },
});

const sendmsg=(otp,email)=>{
    // create nodemailer message
const mailOptions = {
    from: myemail,
    to: email,
    subject: 'One-Time Password (OTP) for Your Account',
    text: `Your OTP code is ${otp}. This code is valid for 1 minutes.`,
  };
  
  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}

module.exports=sendmsg