const express = require('express');
const router = express.Router();

const {
  signup,
  signin,
  signout,
  requireSignin,
} = require('../controllers/auth');
const { userSignupValidator } = require('../validator');

router.post('/signup', userSignupValidator, signups);
router.post('/signin', signins);
router.get('/signout', signoutss);

module.exports = router;
