const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users');

// User Register
router.post('/register', usersController.registerUser);

// User Login
router.post('/login', usersController.loginUser);

// User Logout
router.post('/logout', usersController.logoutUser);

module.exports = router;
