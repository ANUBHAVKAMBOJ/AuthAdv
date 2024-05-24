const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { jwtSecret } = require("../config/config");

const authMiddleware = {
  protect: async (req, res, next) => {
    let token;
    console.log(1, req.headers.authorization);
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
      console.log(2, token);
    }
    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }
    try {
      const decoded = jwt.verify(token, jwtSecret);
      req.user = await User.findById(decoded.id).select("-password");

      console.log(req.user);
      next();
    } catch (error) {
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  },
  admin: (req, res, next) => {
    if (req.user && req.user.role === "admin") {
      next();
    } else {
      res.status(403).json({ message: "Not authorized as an admin" });
    }
  },
};

module.exports = authMiddleware;
