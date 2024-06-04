const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const User = require('../models/User');
const bcrypt = require("bcryptjs");

// Protected route
router.get('/', verifyToken, (req, res) => {
  res.status(200).json({ message: 'Protected route accessed' });
});

// Get user info
router.get('/userinfo', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId); // req.userId est défini dans votre middleware verifyToken
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to get user info" });
  }
});

// Get every user
router.get('/users', verifyToken, async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Failed to get users" });
  }
});

// Update user
router.put('/users/:id', verifyToken, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate
    (req.params.id, req.body, { new: true });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Update failed" });
  }
});

// Delete user
router.delete('/users/:id', verifyToken, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "User deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete user" });
  }
});

// Register new user
router.post('/register', verifyToken, async (req, res) => {
  try {
    const { username, password, figmaToken, role, teamId } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword, figmaToken, role, teamId });
    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ error: "Registration failed" });
  }
});

module.exports = router;
