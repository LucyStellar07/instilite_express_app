// src/controllers/user.controller.js

const { Sequelize } = require('sequelize');
const sequelize = require('../config/config.js'); // Make sure this path is correct
const User = require('../models/user.model');
const catchAsync = require('../utils/catchAsync');

const user_login = catchAsync(async (req, res) => {
  const { user_id, password } = req.body;

  if (!user_id || !password) {
    return res.status(400).json({ message: 'user_id and password are required' });
  }

  try {
    const user = await User.findOne({ where: { user_id } });

    if (!user) {
      return res.status(400).json({ message: 'Invalid user_id' });
    }

    if (user.pass_word !== password) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    res.json({ message: 'Login successful' });
  } catch (error) {
    console.error('Error querying the database:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const user_signup = catchAsync(async (req, res) => {
  const { username, pass_word, role, smail, user_id, events_attended } = req.body;

  if (!username || !pass_word || !role || !smail || !user_id) {
    return res.status(400).json({ message: 'Username, password, role, email, and roll_number are required' });
  }

  try {
    const existingUser = await User.findOne({ where: { user_id } });

    if (existingUser) {
      return res.status(400).json({ message: 'Roll number already exists' });
    }

    const newUser = await User.create({ username, pass_word, role, smail, user_id, events_attended });

    res.status(201).json({ message: 'User registered successfully', user_id: newUser.user_id });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = {
  user_login,
  user_signup,
};
