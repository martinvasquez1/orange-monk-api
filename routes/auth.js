const express = require('express');
const router = express.Router();
const {
  validateSignUp,
  validateSignIn,
} = require('../middlewares/validators/userValidator');
const controller = require('../controllers/authController');

router.post('/sign-up', validateSignUp, controller.signUp);
router.post('/sign-in', validateSignIn, controller.signIn);
router.post('/verify', controller.verify);

module.exports = router;
