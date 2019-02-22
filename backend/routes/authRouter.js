var express = require("express");
var router = express.Router();
var nodemailer = require("nodemailer");
var RandomString = require("randomstring");
const jwt = require("jsonwebtoken");
var bcrypt = require("bcrypt-nodejs");
// var ObjectId = require('mongoose').Types.ObjectId; 
const config = require("../config");

var User = require("../models/users");
var hostName = require('os').hostname();

router.post("/reg", function (req, res) {

  if (!req.body.newUser) return res.status(500);
  const reqUser = req.body.newUser;
  let errors = [];

  if (reqUser.firstName.length < 2 ||
    reqUser.lastName.length < 2 ||
    reqUser.zip.length < 4 ||
    reqUser.phonenumber.length !== 6
  ) {
    errors.push("Kérlek ellenőrizd a megadott adatokat.");
  }
  var regexPatt = new RegExp(
    "[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?"
  );
  var isValidEmail = regexPatt.test(reqUser.email);
  if (!isValidEmail) errors.push( "A megadott emailcím nem megfelelő formátumú. Kérlek ellenőrizd.");
  if (!reqUser.password || !reqUser.confirmpassword) errors.push("Kérlek add meg jelszót.");
  if (reqUser.password.length < 6 || reqUser.confirmpassword.length < 6) errors.push("A jelszónak legalább 6 karakter hosszúnak kell lennie.");
  if (reqUser.password !== reqUser.confirmpassword) errors.push("A jelszavaknak meg kell egyeznie.");
  // TODO: check eula
  // if (reqUser.eula != true || reqUser.correctAge != true) errors.push("Az oldal használatához a szabályzatot és az adatvédelmi szabályzatot is el kell fogadni.");

  if(errors.length !== 0) {
    return res.status(200).send({
      error: errors
    })
  }

  // asynchronous
  // User.findOne wont fire unless data is sent back
  process.nextTick(function () {
    // find a user whose email is the same as the forms email
    // we are checking to see if the user trying to login already exists
    // User.findOne({ 'local.email': email }, function (err, user) {
    User.findOne({ email: reqUser.email }, function (err, user) {
      // if there are any errors, return the error
      if (err) {
        throw err;
      }

      // check to see if theres already a user with that email
      if (user) {
        if (user.isEmailVerified === false) {
          return res.status(200).send({
            error:
              "Email címedre aktíváló emailt küldtünk már. Kérünk aktíváld az email címedet"
          });
        }

        // ==========================================
        // TODO ha ide eljut akkor be kell léptetni
        // ===========================================
      } else {

        // TODO: ha van user és az email címe katív akkor belogineltetni.

        delete reqUser.confirmpassword;
        var newUserObject = new User(reqUser);

        newUserObject.password = newUserObject.generateHash(reqUser.password);

        var date = new Date();
        date.setHours(date.getHours() + 1);
        newUserObject.registered = date;

        newUserObject.isEmailVerified = false;

        let adminAccounts = ['csilla.varfoldi@wangaru-interactive.com',
          'gabor.muranyi@wangaru-interactive.com'];

        let isAdmin = adminAccounts.includes(newUserObject.email);

        if (isAdmin) {
          newUserObject.roles = ["user", "admin"];
        } else {
          newUserObject.roles = ["user"];
        }

        newUserObject.emailVerificationToken = RandomString.generate({
          length: 64
        });

        // save the user
        newUserObject.save(function (err) {
          if (err) throw err;

          var transporter = nodemailer.createTransport({
            // service: 'gmail',
            host: 'mail.artistatwork.eu',
            post: 587,
            auth: {
              user: 'info@artistatwork.eu',
              pass: 'Jelszo24!'
            }
          });

          let mailOptions = {
            from: 'info@artistatwork.eu',
            to: newUserObject.email,
            subject: 'Aktíváló email',
            html: '<a href="https://node-chris.herokuapp.com/verif/' + newUserObject.emailVerificationToken + '" class="btn btn-default">Akíváláshoz kérlek kattints ide.</a>'
          };

          transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
              res.status(200).send({
                succesMessage:
                  "Email címedre aktíváló emailt küldtünk már. Kérünk aktíváld az email címedet."
              });
            }
          });
        });
      }
    });
  });
});

module.exports = router;