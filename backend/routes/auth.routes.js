const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const authMiddleware = require("../middleware/auth.middleware"); // your JWT middleware

// Public routes
router.post("/login", authController.login);
router.post("/register", authController.register);

// Protected routes
router.put("/user/:id", authMiddleware, authController.updateUser);
router.delete("/user/:id", authMiddleware, authController.deleteUser);

module.exports = router;
