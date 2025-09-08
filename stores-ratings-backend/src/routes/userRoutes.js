import express from "express";
import { authenticate, logout } from "../middleware/authMiddleware.js";
import { listStores, submitRating, updatePassword } from "../controllers/userController.js";

const router = express.Router();

// All routes require authentication and role USER
router.use(authenticate);

// Stores
router.get("/stores", listStores);

// Ratings
router.post("/ratings", submitRating);

// Update password
router.put("/password", updatePassword);

// Logout
router.post("/logout", logout);

export default router;
