const mongoose = require('mongoose');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const { userSchema } = require('../schemas/userSchema');

userSchema.pre(/^find/, function(next) {
  // this points to the current query
  this.find({});
  next();
});

userSchema.methods.createSignUpConfirmationCode = function () {
  const resetToken = crypto.randomBytes(6).toString('base64');
  // this.signUpConfirmationToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  this.signUpConfirmationToken = resetToken;
  this.signUpCodeExpiresIn = Date.now() + 60 * 60 * 1000; 
  return resetToken;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  console.log({resetToken}, this.passwordResetToken);
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
}

userSchema.methods.comparePasswords = async function (enteredPassword, userPassword) {
  return await bcrypt.compare(enteredPassword, userPassword);
};

const User = mongoose.model('User', userSchema);

module.exports = User;