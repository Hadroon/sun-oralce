const express = require('express')
const router = express.Router()
const nodemailer = require('nodemailer')
const RandomString = require('randomstring')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt-nodejs')
const {OAuth2Client} = require('google-auth-library');
const CLIENT_ID = '67148300550-i59u3tj3g77c5gv5j85ra1um72ss6uen.apps.googleusercontent.com'
const client = new OAuth2Client(CLIENT_ID);

const config = require('../config')
const secret = process.env.SECRET || config.secret
const User = require('../models/users')
const activationEmailTemplate = require('../emails/activationEmail')
const passwordResetEmailTemplate = require('../emails/resetPasswordEmail')

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

async function verify(token) {
  const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
      // Or, if multiple clients access the backend:
      //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });
  const payload = ticket.getPayload()
  const userid = payload['sub']
  return payload
  // If request specified a G Suite domain:
  //const domain = payload['hd'];
}

router.post('/reg', function (req, res) {
  if (!req.body.newUser) return res.status(500)
  const reqUser = req.body.newUser
  let errors = []

  if (reqUser.firstName.length < 2 ||
    reqUser.lastName.length < 2 ||
    reqUser.zip.length < 4 ||
    reqUser.phonenumber.length !== 7
  ) {
    errors.push('Kérlek, ellenőrizd a megadott adatokat.')
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

      if (user) {
        if (user.isEmailVerified === false) {
          return res.status(200).send({
            succesMessage:
              ['Email címedre már aktíváló emailt küldtünk. Kérünk aktíváld az email címedet']
          })
        } else if (user.isEmailVerified === true) {
          return res.status(200).send({
            succesMessage:
              ['Ezzel az email címmel vár van aktív regisztráció. Kérlek jelentkez be.']
          })
        }
      } else {
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

          let link = 'https://' + req.hostname + '/verif/' + newUserObject.emailVerificationToken

          let emailTemplate = activationEmailTemplate(newUserObject.firstName, link)

          let mailOptions = {
            from: 'info@kornyezetrefel.hu',
            to: newUserObject.email,
            subject: 'Környezetre fel regisztráció aktiválása',
            html: emailTemplate
          }

          transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
              console.log(error)
            } else {
              console.log('Email sent: ' + info.response)
              res.status(200).send({
                succesMessage:
                  ['Erre az email címre már elküldtük az aktíváló emailt. Kérlek, kattints az emailben található aktiváló linkre.']
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
      if (!user.password) return res.status(200).send({ error: ['Nem megfelelő adatok.'] })
      const passCrypt = bcrypt.compareSync(loginData.password, user.password)

      if (!passCrypt) {
        return res.status(200).send({ error: ['Nem megfelelő adatok.'] })
      }

      if (user.isEmailVerified === false) {
        return res.status(200).send({
          info:
            ['Erre az email címre már elküldtük az aktíváló emailt. Kérlek, kattints az emailben található aktiváló linkre.']
        })
      }

      let fullName = user.lastName + ' ' + user.firstName

      let token = jwt.sign({ id: user._id, roles: user.roles, name: fullName, email: user.email }, secret, {
        expiresIn: 86400
      })
      res.status(200).send({ auth: true, token: token, name: fullName, roles: user.roles })
    } else {
      return res.status(200).send({ error: ['Hiba történt. Kérlek, ellenőrizd a belépési adatokat.'] })
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

      let link = 'https://' + req.hostname + '/reset/' + user.passwordToken

      let emailTemplate = passwordResetEmailTemplate(user.firstName, link)

      let mailOptions = {
        from: 'info@kornyezetrefel.hu',
        to: user.email,
        subject: 'Jelszó megváltoztatása',
        html: emailTemplate
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

router.post('/google-login', async (req, res) => {

  // iss: 'accounts.google.com',
  // azp:
  //  '67148300550-i59u3tj3g77c5gv5j85ra1um72ss6uen.apps.googleusercontent.com',
  // aud:
  //  '67148300550-i59u3tj3g77c5gv5j85ra1um72ss6uen.apps.googleusercontent.com',
  // sub: '104479455595354378942',
  // email: 'gabor.muranyi@gmail.com',
  // email_verified: true,
  // at_hash: '3pXLQsUUTTE-ypSek8T_1w',
  // name: 'Gabor Muranyi',
  // picture:
  //  'https://lh3.googleusercontent.com/-CCygCykWWEo/AAAAAAAAAAI/AAAAAAAAEJM/t_zvP263dE4/s96-c/photo.jpg',
  // given_name: 'Gabor',
  // family_name: 'Muranyi',
  // locale: 'en',
  // iat: 1552408710,
  // exp: 1552412310,
  // jti: '44f7f3a7ca7680f067cff190ee90cd743440b79a'

  const googleToken = req.body.googleToken
  const verifiedUser = await verify(googleToken)

  if (verifiedUser.aud !== CLIENT_ID) return

  let user
  user = await User.findOne({ email: verifiedUser.email });

  if (user) {
    // TODO: Ellenőrizni, hogy megvannak-e a checkboxxai
  } else {
    
    user = new User()
    user.email = verifiedUser.email
    user.firstName = verifiedUser.given_name
    user.lastName = verifiedUser.family_name
    user.googleLogin = true
  
    var date = new Date()
    date.setHours(date.getHours() + 1)
    user.registered = date
  
    user.isEmailVerified = true
  
    let adminAccounts = [
      'csilla.varfoldi@wangaru-interactive.com',
      'gabor.muranyi@wangaru-interactive.com'
    ]
  
    let isAdmin = adminAccounts.includes(user.email)
  
    if (isAdmin) {
      user.roles = ['user', 'admin']
    } else {
      user.roles = ['user']
    }
  
    user.save(function (err) {
      if (err) throw err
    })
  }

  let fullName = verifiedUser.family_name + ' ' + verifiedUser.given_name

  let token = jwt.sign({ id: user._id, roles: user.roles, name: fullName, email: user.U3 }, secret, {
    expiresIn: 86400
  })
  
  res.status(200).send({ auth: true, token: token, name: fullName, roles: user.roles })
});

module.exports = router
