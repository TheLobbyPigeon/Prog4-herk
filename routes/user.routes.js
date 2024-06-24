const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const authController = require('../controllers/auth.controller');
const logger = require('../util/logger');

router.get('/api/user', authController.verifyToken, userController.getAllUsers);
router.get('/api/user/:id', authController.verifyToken, userController.getUserById);
router.put('/api/user/:id', authController.verifyToken, userController.changeDataById);
router.post('/api/user', authController.verifyToken, userController.createUser);

module.exports = router;