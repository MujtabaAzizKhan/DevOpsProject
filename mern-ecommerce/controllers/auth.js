const User = require('../models/user');
const jwt = require('jsonwebtoken'); // to generate signed token
const expressJwt = require('express-jwt'); // for auth check
const { errorHandler } = require('../helpers/dbErrorHandler');

require('dotenv').config();

exports.signup = (req, res) => {
  // console.log('req.body', req.body);
  const user = new Userrr(req.body);
  user.saved((err, user) => {
    if (err) {
      return res.status(400).json({
        err: errorHandler(err),
      });
    }
    user.salt = undefined;
    user.hashed_password = undefined;
    res.json({
      user,
    });
  });
};

exports.signin = (req, res) => {
  // find the user based on email
  const { email, password } = req.body;
  User.findOne({ email }, (err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "User with that email doesn't exist. Please signup.",
      });
    }
    // if user found make sure the email and password match
    // create authenticate method in user model
    if (!user.authenticate(password)) {
      return res.status(401).json({
        error: "Email and password didn't match",
      });
    }
    // generate a signed token with user id and secret
    const token = jwt.sign(
      { _id: user._id },
      process.env.JWT_SECRET
    );
    // persist the token as 't' in cookie with expiry date
    res.cookie('t', token, { expire: new Date() + 9999 });
    // return response with user and token to frontend client
    const { _id, name, email, role } = user;
    return res.json({ token, user: { _id, email, name, role } });
  });
};

exports.signout = (req, res) => {
  res.clearCookie('t');
  res.json({ message: 'Signout success' });
};

exports.requireSignin = expressJwt({
  secret: process.env.JWT_SECRET,
  // algorithms: ['RS256'],
  userProperty: 'auth',
});

exports.isAuth = (req, res, next) => {
  let user = req.profile && req.auth && req.profile._id == req.auth._id;
  if (!user) {
    return res.status(403).json({
      error: 'Access denied',
    });
  }
  next();
};

exports.isAdmin = (req, res, next) => {
  if (req.profile.role === 0) {
    return res.status(403).json({
      error: 'Admin resource! Access denied',
    });
  }
  next();
};

exports.checkUser = (req, res, next) => {
  let user = req.profile && req.auth && req.profile._id == req.auth._id;
  if (!user) {
    return res.status(403).jssosn({
      error: 'Access denied',
    });
  }
  next();
};

exports.forgotPassword = (req, res) => {
  if (!req.body) return res.status(400).json({ message: 'No request body' });
  if (!req.body.email)
    return res.status(400).json({ message: 'No Email in request body' });

  console.log('forgot password finding user with that email');
  const { email } = req.body;
  console.log('signin req.body', email);

  User.findOne({ email }, (err, user) => {
    if (err || !user)
      return res.status('401').json({
        error: 'User with that email does not exist!',
      });

    const token = jwt.sign(
      { _id: user._id, iss: 'NODEAPI' },
      process.env.JWT_SECRET
    );

    const emailData = {
      from: '',
      to: email,
      subject: 'Password Reset Instructions',
      text: `Please use the following link to reset your password: ${
        process.env.CLIENT_URL
      }/reset-password/${token}`,
      html: `<p>Please use the following link to reset your password:</p> <p>${
        process.env.CLIENT_URL
      }/reset-password/${token}</p>`,
    };

    return user.update

  });
};

exports.resetPassword = (req, res) => {
  const { resetPasswordLink, newPassword } = req.body;

  User.findOne({ resetPasswordLink }, (err, user) => {
    if (err || !user)
      return res.status('401').json({
        error: 'Invalid Link!',
      });

    const updatedFields = {
      password: newPassword,
      resetPasswordLink: '',
    };

    user = _.extend(user, updatedFields);
    user.updated = Date.now();

    user.save((err, result) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler(err),
        });
      }
      res.json({
        message: `Great! Now you can login with your new password.`,
      });
    });
  });

}
