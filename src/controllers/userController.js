const factoryHandler = require('../handlers/factoryHandler');
const User = require('../models/userModel');

exports.getUser = factoryHandler.getOne(User);