import express from "express"
import * as authController from "../controller/auth.controller";
import { authenticate } from "../middleware/auth.middleware";
const router = express.Router();


// ============================================
// Authentication Routes (Public)
// ============================================
router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/refresh", authController.refreshToken); // Public - uses refresh token from cookie

// Protected auth routes
router.post("/logout", authenticate, authController.logout);

export default router;