const express = require('express');
const userController = require('../../controllers/user.controller');
const router = express.Router();

router
  .route('/')
  .get(userController.user_login)
  .post(userController.user_signup);

module.exports = router;
