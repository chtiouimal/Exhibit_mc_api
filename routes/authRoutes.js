const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const authMiddleware = require('../middleware/authMiddleware');
const Account = require('../models/accountModel');
const User = require('../models/userModel');

const router = express.Router();

// Register a new account
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const accountExists = await Account.findOne({ email });

    if (accountExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      firstName: null,
      lastName: null,
      profession: null
    });

    if (user) {
      const account = await Account.create({
        username,
        email,
        password,
        user: user._id
      });
      
      if (account) {
        const token = generateToken(account._id);
        res.status(201).json({
          _id: account._id,
          username: account.username,
          email: account.email,
          role: account.role,
          user: user,
          token,
        });
      } else {
        res.status(400).json({ message: 'Invalid account data' });
      }
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Login account
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const account = await Account.findOne({ email }).populate('user').exec();

    if (account && (await account.matchPassword(password))) {
      const token = generateToken(account._id);
      
      const accountData = account.toObject();
      res.json({
        account: {
          _id: accountData._id,
          username: accountData.username,
          email: accountData.email,
          role: accountData.role,
          createdAt: accountData.createdAt,
          updatedAt: accountData.updatedAt,
          user: accountData.user, // This will be the full populated User object
        },
        token,
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user profile
router.get('/profile', authMiddleware, async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  res.json(user);
});

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

module.exports = router;
