var express = require('express')
var router = express.Router()
var nodemailer = require('nodemailer')
var RandomString = require('randomstring')
const jwt = require('jsonwebtoken')
var bcrypt = require('bcrypt-nodejs')
// var ObjectId = require('mongoose').Types.ObjectId;
const config = require('../config')

const secret = process.env.SECRET || config.secret
var User = require('../models/users')
// var hostName = require('os').hostname()

const transporter = nodemailer.createTransport({
  host: 'cl05.webspacecontrol.com',
  post: 465,
  secure: true,
  auth: {
    user: 'info@kornyezetrefel.hu',
    pass: process.env.MAILPASS || config.infoEmailPass
  },
  tls: {
    rejectUnauthorized: false
  }
})

router.post('/reg', function (req, res) {
  if (!req.body.newUser) return res.status(500)
  const reqUser = req.body.newUser
  let errors = []

  if (reqUser.firstName.length < 2 ||
    reqUser.lastName.length < 2 ||
    reqUser.zip.length < 4 ||
    reqUser.phonenumber.length !== 7
  ) {
    errors.push('Kérlek ellenőrizd a megadott adatokat.')
  }
  var regexPatt = new RegExp(
    "[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?"
  );
  var isValidEmail = regexPatt.test(reqUser.email)
  if (!isValidEmail) errors.push('A megadott emailcím nem megfelelő formátumú. Kérlek ellenőrizd.')
  if (!reqUser.password || !reqUser.confirmpassword) errors.push('Kérlek add meg jelszót.')
  if (reqUser.password.length < 6 || reqUser.confirmpassword.length < 6) errors.push('A jelszónak legalább 6 karakter hosszúnak kell lennie.')
  if (reqUser.password !== reqUser.confirmpassword) errors.push('A jelszavaknak meg kell egyeznie.')
  // TODO: check eula
  // if (reqUser.eula != true || reqUser.correctAge != true) errors.push("Az oldal használatához a szabályzatot és az adatvédelmi szabályzatot is el kell fogadni.");

  if (errors.length !== 0) {
    return res.status(200).send({
      error: errors
    })
  }

  // asynchronous
  // User.findOne wont fire unless data is sent back
  process.nextTick(function () {
    User.findOne({ email: reqUser.email }, function (err, user) {
      // if there are any errors, return the error
      if (err) {
        throw err
      }

      // check to see if theres already a user with that email
      if (user) {
        if (user.isEmailVerified === false) {
          return res.status(200).send({
            succesMessage:
              ['Email címedre már aktíváló emailt küldtünk. Kérünk aktíváld az email címedet']
          })
        }

        // ==========================================
        // TODO ha ide eljut akkor be kell léptetni
        // ===========================================
      } else {
        // TODO: ha van user és az email címe katív akkor belogineltetni.

        delete reqUser.confirmpassword
        var newUserObject = new User(reqUser)
        newUserObject.password = newUserObject.generateHash(reqUser.password)

        var date = new Date()
        date.setHours(date.getHours() + 1)
        newUserObject.registered = date

        newUserObject.isEmailVerified = false

        let adminAccounts = ['csilla.varfoldi@wangaru-interactive.com',
          'gabor.muranyi@wangaru-interactive.com']

        let isAdmin = adminAccounts.includes(newUserObject.email)

        if (isAdmin) {
          newUserObject.roles = ['user', 'admin']
        } else {
          newUserObject.roles = ['user']
        }

        newUserObject.emailVerificationToken = RandomString.generate({
          length: 64,
          charset: 'alphanumeric'
        })

        // save the user
        newUserObject.save(function (err) {
          if (err) throw err

          let mailOptions = {
            from: 'info@kornyezetrefel.hu',
            to: newUserObject.email,
            subject: 'Aktíváló email',
            html: '<a href="https://www.kornyezetrefel.hu/verif/' + newUserObject.emailVerificationToken + '" class="btn btn-default">Akíváláshoz kérlek kattints ide.</a>'
            // html: '<a href="http://localhost:8080/verif/' + newUserObject.emailVerificationToken + '" class="btn btn-default">Akíváláshoz kérlek kattints ide.</a>'
          }

          transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
              console.log(error)
            } else {
              console.log('Email sent: ' + info.response)
              res.status(200).send({
                succesMessage:
                  ['Email címedre már aktíváló emailt küldtünk. Kérünk aktíváld az email címedet.']
              })
            }
          })
        })
      }
    })
  })
})

router.post('/login', function (req, res) {
  const loginData = req.body.user

  if (!loginData) {
    return res.status(200).send({ error: ['Bejelentkezéshez add meg email címedet és jelszavad.'] })
  }

  User.findOne({ email: loginData.email }, function (err, user) {
    if (err) {
      return res.status(200).send({
        error:
          ['Nem megfelelő adatok.']
      })
    }

    if (user) {
      const passCrypt = bcrypt.compareSync(loginData.password, user.password)

      if (!passCrypt) {
        return res.status(200).send({ error: ['Nem megfelelő adatok.'] })
      }

      if (user.isEmailVerified === false) {
        return res.status(200).send({
          info:
            ['Email címedre már aktíváló emailt küldtünk. Kérünk aktíváld az email címedet.']
        })
      }

      let fullName = user.lastName + ' ' + user.firstName

      let token = jwt.sign({ id: user._id, roles: user.roles, name: fullName, email: user.email }, secret, {
        expiresIn: 86400
      })
      res.status(200).send({ auth: true, token: token, name: fullName, roles: user.roles })
    } else {
      return res.status(200).send({ error: ['Hiba történt. Kérlek ellenőrizd a belépési adatokat.'] })
    }
  })
})

router.get('/validateemail/:token', async (req, res) => {
  try {
    let user = await User.findOne({ emailVerificationToken: req.params.token })
    if (user) {
      user.isEmailVerified = true
      await user.save()

      let fullName = user.lastName + ' ' + user.firstName

      let token = jwt.sign({ id: user._id, roles: user.roles, name: fullName, email: user.email }, secret, {
        expiresIn: 86400
      })
      res.status(200).send({ auth: true, token: token, name: fullName, roles: user.roles })
    } else {
      res.status(200).send({ auth: false })
    }
  } catch (err) {
    console.log(err)
    throw err
  }
})

router.get('/check/:token', async (req, res) => {
  let token = req.params.token
  try {
    var decoded = jwt.verify(token, secret)
    let user = await User.findById(decoded.id, null, { lean: true })
    if (!user) return res.status(200).send({ auth: false })
  } catch (err) {
    return res.status(200).send({ auth: false })
  }

  if (decoded.name) {
    return res.status(200).send({ auth: true, name: decoded.name, roles: decoded.roles, token: token })
  }
  return res.status(200).send({ auth: false })
})

router.post('/resetback', async (req, res) => {
  try {
    let user = await User.findOne({ email: req.body.email });
    user.passwordToken = RandomString.generate({
      length: 64,
      charset: 'alphanumeric'
    });

    if(user && user.isEmailVerified) {
      await user.save();

      let mailOptions = {
        from: 'info@kornyezetrefel.hu',
        to: user.email,
        subject: 'Jelszó megváltoztatása',
        html: '<a href="https://www.kornyezetrefel.hu/reset/' + user.passwordToken + '" class="btn btn-default">Jelszócseréhez kérlek kattints ide.</a>'
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
          res.status(200).send({
            error:
              ["Hiba történt, a megadott email címre nem tudtunk levelet küldeni."]
          });
        } else {
          console.log('Email sent: ' + info.response);
          res.status(200).send({
            info:
              ["Email címedre emailt küldtünk, hogy meg tud változtatni a jelszavad."]
          });
        }
      });
    } else {
      res.status(200).send({
        error:
          ["Kérjük ellenőrizd a megadott emailcímet vagy aktíváld."]
      });
    }
  } catch (err) {
    console.log(err);
    res.status(200).send({
      error:
        ["Hiba történt"]
    });
  }
});

router.post('/resetpass', async (req, res) => {

  if (req.body.passOne.length < 6 || req.body.passTwo.length < 6) {
    return res.status(200).send({
      error: ["A jelszónak legalább 6 karakter hosszúnak kell lennie."]
    });
  }

  if (req.body.passOne !== req.body.passTwo) {
    return res.status(200).send({ error: ["A jelszavaknak meg kell egyeznie."] });
  }

  try {
    let user = await User.findOne({ passwordToken: req.body.token });
    if (user && user.isEmailVerified) {

      user.password = user.generateHash(req.body.passOne);
      await user.save();

      let fullName = user.lastName + ' ' + user.firstName;

      let token = jwt.sign({ id: user._id, roles: user.roles, name: fullName, email: user.email }, secret, {
        expiresIn: 86400
      });

      res.status(200).send({ auth: true, token: token, name: fullName, roles: user.roles });
    } else {
      res.status(200).send({
        error:
          ["Hiba történt."]
      });

    }
  } catch (err) {
    console.log(err);
    throw err;
  }
});

module.exports = router
