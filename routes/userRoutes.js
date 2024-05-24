const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const userController = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");

router.get("/profile", authMiddleware.protect, userController.getProfile);

router.put(
  "/profile",
  authMiddleware.protect,
  [
    check("email", "Please include a valid email").optional().isEmail(),
    check("name", "Name is required").optional().not().isEmpty(),
  ],
  userController.updateProfile,
);

router.get("/public", userController.listPublicProfiles);

router.get("/:id", authMiddleware.protect, userController.getUserProfile);

module.exports = router;
