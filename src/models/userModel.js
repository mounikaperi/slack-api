const mongoose = require('mongoose');
const crypto = require('crypto');
const {userSchema} = require('../schemas/userSchema');

userSchema.pre(/^find/, function(next) {
  // this points to the current query
  this.find({});
  next();
});

userSchema.methods.createSignUpConfirmationCode = function () {
  const resetToken = crypto.randomBytes(6).toString('base64');
  console.log({ resetToken }, this.signUpConfirmationToken);
  this.signUpConfirmationToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  console.log({ resetToken }, this.signUpConfirmationToken);
  this.signUpCodeExpiresIn = Date.now() + 10 * 60 * 1000; 
  return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;