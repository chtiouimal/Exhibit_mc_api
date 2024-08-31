const express = require('express');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middleware/authMiddleware');
const Account = require('../models/accountModel');
const User = require('../models/userModel');
const withModel = require('../middleware/withModel');

const router = express.Router();

// Register a new account
// router.post('/register', async (req, res) => {
//   const { username, email, password } = req.body;

//   try {
//     const accountExists = await Account.findOne({ email });

//     if (accountExists) {
//       return res.status(400).json({ message: 'User already exists' });
//     }

//     const user = await User.create({
//       firstName: null,
//       lastName: null,
//       profession: null
//     });

//     if (user) {
//       const account = await Account.create({
//         username,
//         email,
//         password,
//         user: user._id
//       });
      
//       if (account) {
//         const token = generateToken(account._id);
//         res.status(201).json({
//           _id: account._id,
//           username: account.username,
//           email: account.email,
//           role: account.role,
//           user: user,
//           token,
//         });
//       } else {
//         res.status(400).json({ message: 'Invalid account data' });
//       }
//     }
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

router.post('/register', withModel({ Account: Account.schema, User: User.schema }), async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const accountExists = await req.models.Account.findOne({ email });

    if (accountExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await req.models.User.create({
      firstName: null,
      lastName: null,
      profession: null
    });

    if (user) {
      const account = await req.models.Account.create({
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
})

// Login account
// router.post('/login', async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const account = await Account.findOne({ email }).populate('user').exec();

//     if (account && (await account.matchPassword(password))) {
//       const token = generateToken(account._id);
      
//       const accountData = account.toObject();
//       res.json({
//         account: {
//           _id: accountData._id,
//           username: accountData.username,
//           email: accountData.email,
//           role: accountData.role,
//           createdAt: accountData.createdAt,
//           updatedAt: accountData.updatedAt,
//           user: accountData.user,
//         },
//         token,
//       });
//     } else {
//       res.status(401).json({ message: 'Invalid email or password' });
//     }
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

router.post('/login', withModel({ Account: Account.schema, User: User.schema }), async (req, res) => {
  const { email, password } = req.body;

  try {
    const account = await req.models.Account.findOne({ email }).populate('user').exec();

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
          user: accountData.user,
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
// router.get('/profile/:id', authMiddleware, async (req, res) => {
//   const {id} = req.params
//   const user = await User.findById(id);
//   res.json(user);
// });

router.get('/profile/:id', withModel({ User: User.schema }), authMiddleware, async (req, res) => {
  const {id} = req.params
  const user = await req.models.User.findById(id);
  res.json(user);
});

// router.put('/profile/:id', authMiddleware, async (req,res) => {
//   const { id } = req.params;
//   try {
//     const user = await User.findByIdAndUpdate(id, req.body)
//     if (!user) {
//       return res.status(404).json({ message: "cannot find the requested user" })
//     }
//     const updatedUser = await User.findById(id)
//     res.status(200).json(updatedUser)
//   } catch (error) {
//     res.status(500).json({ message: error.message })
//   }
// })

router.put('/profile/:id', withModel({ User: User.schema }), authMiddleware, async (req,res) => {
  const { id } = req.params;
  try {
    const user = await req.models.User.findByIdAndUpdate(id, req.body)
    if (!user) {
      return res.status(404).json({ message: "cannot find the requested user" })
    }
    const updatedUser = await req.models.User.findById(id)
    res.status(200).json(updatedUser)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

module.exports = router;
