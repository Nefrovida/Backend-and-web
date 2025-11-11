import express from "express"
import * as authController from "../controller/auth.controller";
import { authenticate } from "../middleware/auth.middleware";
const router = express.Router();


// ============================================
// Authentication Routes (Public)
// ============================================
router.post("/register", authController.register);
router.post("/login", authController.login);

// Protected auth routes
router.post("/refresh", authenticate, authController.refreshToken);
router.post("/logout", authenticate, authController.logout);

export default router;