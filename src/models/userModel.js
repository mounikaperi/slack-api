const mongoose = require('mongoose');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const { userSchema } = require('../schemas/userSchema');

userSchema.pre(/^find/, function(next) {
  // this points to the current query
  this.find({});
  next();
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next(); // Only run this function if the password is modified
  this.password = await bcrypt.hash(this.password, 12); // Upon save, hash the password at the cost of 12
  this.passwordConfirm = undefined; // delete the passwordConfirm field
  next();
});

// userSchema.pre('save', function(next) {
//   this.find({ active: { $ne: false } }); // find only active users. deleted users will be present in db but will be marked to inactive
//   next();
// });

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

userSchema.methods.comparePasswords = async function(enteredPassword, userPassword) {
  console.log(enteredPassword);
  console.log(userPassword);
  return await bcrypt.compare(enteredPassword, userPassword);
  // return enteredPassword === userPassword;
};

const User = mongoose.model('User', userSchema);

module.exports = User;