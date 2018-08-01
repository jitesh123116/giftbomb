/*
 * @Author: Sachin Kumar
 * @Date:   13/june/2017
 */
const nodemailer = require('nodemailer');
var Promise = require('bluebird');

// create reusable transporter object using the default SMTP transport
var transporter = nodemailer.createTransport({
    service:"Gmail",
    port: 587,
    secure: false, // secure:true for port 465, secure:false for port 587
    auth: {
        user: 'sachin.kumar@affle.com',
        pass: 'duhcykyairbbyhoa'
    }
});

var emailCtrl = (function(){
  this.sendMail = function(to,sub,htmlBody){    
    var promise = new Promise(function(resolve, reject){
      var mailOptions = {};
      mailOptions.from = "sachin.kumar@affle.com";
      mailOptions.to = to;
      mailOptions.subject = sub;
      mailOptions.html = htmlBody;
      // send mail with defined transport object
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          reject(error);
          return;
        }else{
          resolve(info)
          console.log('Message %s sent: %s', info.messageId, info.response);
        }
      });
    })
    return promise;
  }
  return this;
}());

module.exports = emailCtrl;