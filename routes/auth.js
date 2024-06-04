const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require('cors');
require('dotenv').config();

router.use(cors({
  origin: function(origin, callback){
    const whitelist = ['http://localhost:4200', 'https://maquettes.geek-tonic.dev', 'https://api-maquette.onrender.com'];
    if(whitelist.indexOf(origin) !== -1){
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}));

// User registration
// router.post("/register", async (req, res) => {
//   try {
//     const { username, password, figmaToken, role, teamId } = req.body;
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const user = new User({ username, password: hashedPassword, figmaToken, role, teamId });
//     await user.save();
//     res.status(201).json({ message: "User registered successfully" });
//   } catch (error) {
//     res.status(500).json({ error: "Registration failed" });
//   }
// });

// Update user
// router.put("/users/:id", async (req, res) => {
//   try {
//     const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
//     res.status(200).json(user);
//   } catch (error) {
//     res.status(500).json({ error: "Update failed" });
//   }
// });

// Get all users
// router.get("/users", async (req, res) => {
//   try {
//     const users = await User.find({});
//     res.status(200).json(users);
//   } catch (error) {
//     res.status(500).json({ error: "Failed to get users" });
//   }
// });

// User login
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log(`Login attempt for username: ${username}`);

    const user = await User.findOne({ username });
    if (!user) {
      console.log(`User not found: ${username}`);
      return res.status(401).json({ message: "Authentication failed" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      console.log(`Password mismatch for user: ${username}`);
      return res.status(401).json({ message: "Authentication failed" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.status(200).json({ message: "Connexion réussie", token, figmaToken: user.figmaToken, role: user.role, teamId: user.teamId});
  } catch (error) {
    console.log(`Login error: ${error.message}`);
    res.status(500).json({ error: "Login failed" });
  }
});

module.exports = router;
