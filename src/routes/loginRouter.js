const express = require('express');
const loginController = require('../controllers/loginController');

const router = express.Router();

// Flow -1: Login via Email Only - Confirmation code will be sent to Email - reenter code to signin
router.post('/createSignInMagicalCode', loginController.createSignInMagicalCode);
router.patch('/signInWithMagicalCode/:code', loginController.signInWithMagicalCode);

// Flow -2: Login manually- Needs workspace as Input - if workspace present
// 1. Sign in via Okta  - Give an octa page to Sign in
// 2. Sign in via guest account - Enter username and password - if valid sign in
//    forgotPassword functionality - enter your email. reset link will be sent - resetPassword should be done
router.post('/signUpWithEmailNPassword', loginController.signUpWithEmailNPassword);
router.post('/signInWithEmailNPassword', loginController.signInWithEmailNPassword);
module.exports = router;