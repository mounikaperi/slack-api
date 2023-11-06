const mongoose = require('mongoose');
const {userSchema} = require('../schemas/userSchema');

userSchema.pre(/^find/, function(next) {
  // this points to the current query
  this.find({});
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;