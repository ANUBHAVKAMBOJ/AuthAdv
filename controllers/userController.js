const User = require("../models/User");
const { check, validationResult } = require("express-validator");

const userController = {
  getProfile: async (req, res) => {
    try {
      const user = await User.findById(req.user._id).select("-password");
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  },
  updateProfile: async (req, res) => {
    console.log(req.body, req.file);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { name, bio, phone, email, isPublic } = req.body;
    try {
      const user = await User.findById(req.user._id);
      if (user) {
        user.name = name || user.name;
        user.bio = bio || user.bio;
        user.phone = phone || user.phone;
        user.email = email || user.email;
        user.isPublic = isPublic !== undefined ? isPublic : user.isPublic;
        const updatedUser = await user.save();
        // remove password from the response
        updatedUser.password = undefined;
        res.json(updatedUser);
      } else {
        res.status(404).json({ message: "User not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  },
  listPublicProfiles: async (req, res) => {
    try {
      const users = await User.find({ isPublic: true }).select("-password");
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  },
  getUserProfile: async (req, res) => {
    try {
      const user = await User.findById(req.params.id).select("-password");
      if (user) {
        if (user.isPublic || req.user.role === "admin") {
          res.json(user);
        } else {
          res.status(403).json({ message: "Private profile" });
        }
      } else {
        res.status(404).json({ message: "User not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  },
};

module.exports = userController;
