var express = require("express");
var router = express.Router();
var nodemailer = require("nodemailer");
var RandomString = require("randomstring");
const jwt = require("jsonwebtoken");
var bcrypt = require("bcrypt-nodejs");
// var ObjectId = require('mongoose').Types.ObjectId; 
// const config = require("../config");

// var User = require("../models/users");
var hostName = require('os').hostname();

router.get("/mail", function(req, res) {

  console.log(process.env.MAILPASS)

  var transporter = nodemailer.createTransport({
    // service: 'gmail',
    host: 'cl05.webspacecontrol.com',
    post: 465,
    secure: true,
    auth: {
      user: 'info@kornyezetrefel.hu',
      pass: process.env.MAILPASS
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  // process.env.PORT

  let mailOptions = {
    from: 'info@kornyezetrefel.hu',
    to: 'gabor.muranyi@gmail.com',
    subject: 'Jelszó megváltoztatása heroku',
    html: '<p>Ez egy hivatalos email</p>'
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
      res.status(200).send('Email sent: ' + info.response);
    }
  });
  res.status(200).send('A levél elküldve');

});

router.post("/reg", function (req, res) {
  const reqUser = req.body.user;

  if (reqUser.firstName.length < 2 ||
    reqUser.lastName.length < 2 ||
    reqUser.zipCode.length < 4 ||
    reqUser.city.length < 2 ||
    reqUser.street.length < 2 ||
    reqUser.houseNumber.length < 1 ||
    reqUser.phoneNumber.length < 4
    ) {
      return res.status(200).send({
        error: "Kérlek add meg az összes adatot."
      });
    }

  var regexPatt = new RegExp(
    "[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?"
  );
  var isValidEmail = regexPatt.test(reqUser.email);

  if (!isValidEmail) {
    return res.status(200).send({
      error: "A megadott emailcím nem megfelelő formátumú. Kérlek ellenőrizd."
    });
  }


  if (!reqUser.password || !reqUser.passwordTwo) {
    return res.status(200).send({
      error: "Kérlek add meg jelszót."
    });
  }

  if (reqUser.password.length < 6 || reqUser.passwordTwo.length < 6) {
    return res.status(200).send({
      error: "A jelszónak legalább 6 karakter hosszúnak kell lennie."
    });
  }

  if (reqUser.password !== reqUser.passwordTwo) {
    return res.status(200).send({ error: "A jelszavaknak meg kell egyeznie." });
  }

  if (reqUser.eula != true || reqUser.correctAge != true) {
    return res.status(200).send({
      error:
        "Az oldal használatához a szabályzatot és az adatvédelmi szabályzatot is el kell fogadni."
    });
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

        delete reqUser.passwordTwo;
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

router.post("/login", function (req, res) {

  if (!req.body.email || !req.body.password) {
    return res.status(200).send({ error: "Bejelentkezéshez add meg email címedet és jelszavad." });
  }

  User.findOne({ email: req.body.email }, function (err, user) {
    if (err) {
      return res.status(200).send({
        error:
          "Nem megfelelő adatok."
      });
    }

    if (user) {
      const passCrypt = bcrypt.compareSync(req.body.password, user.password);

      if (!passCrypt) {
        return res.status(200).send({ error: "Nem megfelelő adatok." });
      }

      if (user.isEmailVerified === false) {
        return res.status(200).send({
          error:
            "Email címedre aktíváló emailt küldtünk már. Kérünk aktíváld az email címedet."
        });
      }

      let fullName = user.lastName + ' ' + user.firstName;

      let token = jwt.sign({ id: user._id, roles: user.roles, name: fullName, email: user.email }, config.secret, {
        expiresIn: 86400
      });

      res.status(200).send({ auth: true, token: token, name: fullName, roles: user.roles });

    } else {
      return res.status(200).send({ error: "Hiba történt. Kérlek ellenőrizd a belépési adatokat." });
    }
  });
});

router.post('/check', async (req, res) => {
  if (!req.body.token) return;
  try {
    var decoded = jwt.verify(req.body.token, config.secret);
    let user = await User.findById(decoded.id, null, {lean: true});
    if(!user) return res.status(200).send({ error: true });
  }
  catch (err) {
    return res.status(200).send({ error: true });
  }

  if (decoded.name) {
    return res.status(200).send({ auth: true, name: decoded.name, roles: decoded.roles });
  }
  return res.status(200).send({ error: true });
});

router.get('/validateemail/:token', async (req, res) => {
  try {
    let user = await User.findOne({ emailVerificationToken: req.params.token });
    if (user) {
      user.isEmailVerified = true;
      await user.save();

      let fullName = user.lastName + ' ' + user.firstName;

      let token = jwt.sign({ id: user._id, roles: user.roles, name: fullName, email: user.email }, config.secret, {
        expiresIn: 86400
      });


      res.status(200).send({ auth: true, token: token, name: fullName });
    }
  } catch (err) {
    throw err;
  }
});

router.post('/reset', async (req, res) => {
  try {
    let user = await User.findOne({ email: req.body.email });
    user.passwordToken = RandomString.generate({
      length: 64
    });

    if(user && user.isEmailVerified) {
      await user.save();

      var transporter = nodemailer.createTransport({
        // service: 'gmail',
        host: 'mail.artistatwork.eu',
        post: 587,
        secure: true,
        auth: {
          user: 'info@artistatwork.eu',
          pass: 'Jelszo24!'
        },
        tls: {
          rejectUnauthorized: false
        }
      });

      let mailOptions = {
        from: 'info@artistatwork.eu',
        to: user.email,
        subject: 'Jelszó megváltoztatása',
        html: '<a href="https://node-chris.herokuapp.com/reset/' + user.passwordToken + '" class="btn btn-default">Jelszócseréhez kérlek kattints ide.</a>'
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
          res.status(200).send({
            forgotMessage:
              "Email címedre emailt küldtünk. Kérünk ellenőrizd."
          });
        }
      });
    } else {
      res.status(200).send({
        forgotMessage:
          "Kérjük ellenőrizd a megadott emailcímet vagy aktíváld."
      });
    }
  } catch (err) {
    console.log(err);
    res.status(200).send({
      forgotMessage:
        "Hiba történt"
    });
  }
});

router.post('/resetpass', async (req, res) => {

  if (req.body.passone.length < 6 || req.body.passtwo.length < 6) {
    return res.status(200).send({
      error: "A jelszónak legalább 6 karakter hosszúnak kell lennie."
    });
  }

  if (req.body.passOne !== req.body.passTwo) {
    return res.status(200).send({ error: "A jelszavaknak meg kell egyeznie." });
  }

  try {
    let user = await User.findOne({ passwordToken: req.body.token });
    if (user && user.isEmailVerified) {

      user.password = user.generateHash(req.body.passone);
      await user.save();

      let fullName = user.lastName + ' ' + user.firstName;

      let token = jwt.sign({ id: user._id, roles: user.roles, name: fullName, email: user.email }, config.secret, {
        expiresIn: 86400
      });

      res.status(200).send({ auth: true, token: token, name: fullName });
    }
  } catch (err) {
    throw err;
  }
});

module.exports = router;
