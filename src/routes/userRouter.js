const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/signUpWithMagicalCode', authController.signUpWithMagicalCode);
// router.post('/signInWithEmailPassword', authController.signInWithEmailPassword);
// router.post('signUpWithOAuth', authController.signUpWithOAuth);

router.post('/', userController.createUser);

router
  .route('/:id')
  .get(userController.getUser);

module.exports = router;