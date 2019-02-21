const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
// mongoose.Types.ObjectId;
const config = require('../config');

var Submission = require('../models/submission');
var User = require('../models/users');


router.use(function(req, res, next) {

    // check header or url parameters or post parameters for token
    var token = req.body.token || req.get('henkeltoken');
  
    // decode token
    if (token) {
      // verifies secret and checks exp
      jwt.verify(token, config.secret, function(err, decoded) {       
        if (err) {
          return res.json({ success: false, message: 'Failed to authenticate token.' });       
        } else {
          // if everything is good, save to request for use in other routes
          req.decoded = decoded;
          next();
        }
      });
    } else {
      return res.status(404).send({ 
          success: false, 
          message: 'No token provided.' 
      });
    }
  });

router.get('/getusersubmissions', async (req, res) => {
  let userId = req.decoded.id;
  let subbmissions;
  try {
    subbmissions = await Submission.find ( {userId: userId} );
    return res.status(200).send({ message: subbmissions });
  } catch(err) {
    return res.status(200).send({ message: [], nocode: 'Még nincs kódbeküldésed.' });
  }
});

router.post('/submission', async (req, res) => {
  let body = req.body;
  let userId = new ObjectId(req.decoded.id);

  // TODO: mindent lementeni és status kódok kellenek, hogy minden beküldés visszakereshető legyen

  // TODO: ellenőrizni, hogy van-e már ilyen pályázat

  // TODO: ellenőrizni, hogy a játékidőbe beleesik a vásárlás időpontja, egy constans filebe tárolni

  let submission = new Submission();
  submission.userId = new ObjectId(userId);
  submission.dateOfPurchase = body.timestampDateOfPurchase;
  submission.apCode = body.apCode;
  submission.dateOfSubmission = new Date().getTime();
  submission.email = req.decoded.email;

  submission.save(function (err) {
    if (err) throw err;
  });

  return res.status(200).send({ message: 'Köszi a kódot'});
});

router.get('/getsubmissionsdatas', async (req, res) => {
  let userId = new ObjectId(req.decoded.id);

  let submissions = await Submission.find({});

  console.log(submissions);

  return res.status(200).send({ message: 'Köszi a kódot'});
});

module.exports = router;
