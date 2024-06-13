const express = require('express');
const router = express.Router();

const {
  signup,
  signin,
  signout,
  requireSignin,
} = require('../controllers/auth');
const { userSignupValidator } = require('../validator');

router.post('/signup', userSignupValidator, signupss);
router.post('/signin', signinss);
router.get('/signout', signoutss);

module.exports = router;
