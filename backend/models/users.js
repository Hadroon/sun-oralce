var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
const ObjectId = mongoose.Schema.Types.ObjectId;

var userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: String,
  firstName: String,
  lastName: String,
  zip: Number,
  phonenumber: String,
  operator: Number,
  bornYear: Number,
  gender: String,
  eula: Boolean,
  correctAge: Boolean,

  isEmailVerified: Boolean,
  registered: Date,
  emailVerificationToken: String,
  passwordToken: String,
  roles: Array,
  googleLogin: Boolean,
  result: Array
});

userSchema.methods.generateHash = function (password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

mongoose.model('User', userSchema);

module.exports = userSchema;