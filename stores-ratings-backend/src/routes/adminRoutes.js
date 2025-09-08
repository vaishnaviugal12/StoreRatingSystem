import express from "express";
import {
  getDashboard,
  addUser,
  listUsers,
  addStore,
  listStores,
} from "../controllers/adminController.js";
import { authenticate, requireRole, logout } from "../middleware/authMiddleware.js";

const router = express.Router();

// Protect all routes with authentication + ADMIN role
router.use(authenticate, requireRole(["ADMIN"]));

// Dashboard
router.get("/dashboard", getDashboard);

// Users
router.post("/users", addUser);
router.get("/users", listUsers);

// Stores
router.post("/stores", addStore);
router.get("/stores", listStores);
router.post("/logout", logout);

export default router;
