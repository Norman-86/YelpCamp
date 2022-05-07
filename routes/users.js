const express = require('express');
const router = express.Router();
const passport = require('passport');
const users = require('../controllers/users');
const catchAsync = require('../utilities/catchAsync');

router.route('/register')
//user registration form
.get(users.renderRegisterForm)
//user register
.post(catchAsync(users.registerUser))

router.route('/login')
//user login form
.get(users.renderLoginForm)
//user login
.post(passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), users.loginUser);

 //logout
router.get('/logout', users.logoutUser);

module.exports = router;