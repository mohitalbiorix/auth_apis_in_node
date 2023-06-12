const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');
const checkUserAuth = require('../middleware/auth.middleware')

// Public Routes
router.post('/register', userController.userRegistration);
router.post('/login', userController.userLogin);

// Protected Routes
router.post('/changePassword', checkUserAuth, userController.changeUserPassword);
router.get('/loggeduser', checkUserAuth, userController.loggedUser)

module.exports = router;

