const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { jwtSecret, jwtExpiration } = require("../config/config");
const { check, validationResult } = require("express-validator");

const generateToken = (id) => {
  return jwt.sign({ id }, jwtSecret, { expiresIn: jwtExpiration });
};

const authController = {
  register: async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { name, email, password } = req.body;
    try {
      const userExists = await User.findOne({ email });
      if (userExists) {
        return res.status(400).json({ message: "User already exists" });
      }
      const user = await User.create({ name, email, password });
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  },
  login: async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
      if (user && (await user.matchPassword(password))) {
        res.json({
          _id: user._id,
          name: user.name,
          email: user.email,
          token: generateToken(user._id),
        });
      } else {
        res.status(401).json({ message: "Invalid email or password" });
      }
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  },
  logout: (req, res) => {
    res.status(200).json({ message: "User logged out" });
  },
};

module.exports = authController;
