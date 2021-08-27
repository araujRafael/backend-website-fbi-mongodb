const path = require('path')
const nodemailer = require("nodemailer")
const hbs = require("nodemailer-express-handlebars")
const {host,port,user,pass} = require("../config/mailer.js");

var transport = nodemailer.createTransport({
    host,
    port,
    auth: {
      user,
      pass
    }
  });

  transport.use('compile',hbs({
      viewEngine: '.handlebars',
      // viewPath: path.resolve('./resources/mail/auth/'),
      // template: 'forgot_password',
      extName: '.html',
  }))

  module.exports = transport