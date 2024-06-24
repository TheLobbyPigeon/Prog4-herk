const userService = require('../services/user.services.js');
const logger = require('../util/logger');
const validate = require('../validation/user.validation');

let userController = {

  getAllUsers: async (req, res) => {
    try {
      const users = await userService.getAllUsers();
      res.status(200).json(users);
    } catch (error) {
      logger.error(`Error in familyUser.getAllUsers: ${error}`);
      res.status(500).send('Internal Server Error');
    }
  },

  getUserById: async (req, res) => {
    try {
      const user = await userService.getUserById(req.params.id);
      try {
        if (user.UserId) {
          res.status(200).json({
            message: 'User found successfully',
            data: user
          });
        }
      } catch {
        res.status(404).json({
          message: 'User not found'
        });
      }
    } catch (error) {
      logger.error(`Error in familyUser.getUserById: ${error}`);
      res.status(500).send('Internal Server Error');
    }
  },

  changeDataById: async (req, res) => {
    try {
      const user = await userService.changeDataById(req.params.id, req.body);
      res.status(200).json({
        message: 'User updated successfully',
        data: user
      });
    } catch (error) {
      logger.error(`Error in user.getUserById: ${error}`);
      res.status(500).send('Internal Server Error');
    }
  },

  addUser: async (req, res) => {
    const validationError = await validate.validateUserInput(req.body);
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    try {
      // Check if the user with the same email already exists
      const existingUser = await userService.getUserByEmail(req.body.Email);
      if (existingUser) {
        return res.status(409).json({ message: 'Email already in use' });
      }

      const user = await userService.addUser(req.body);
      res.status(201).json({
        message: 'User created successfully',
        data: user
      });
    } catch (error) {
      if (error.name === 'ValidationError') {
        res.status(422).json({ message: error.message });
      } else {
        logger.error(`Error in userController.addUser: ${error}`);
        res.status(500).send('Internal Server Error');
      }
    }
  }
}

module.exports = userController;