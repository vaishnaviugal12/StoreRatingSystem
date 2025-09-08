import express from "express";
import { getDashboard, updatePassword } from "../controllers/ownerController.js";
import { authenticate, requireRole, logout } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authenticate, requireRole(["OWNER"]));

router.get("/dashboard", getDashboard);
router.put("/password", updatePassword);
router.post("/logout", logout);

export default router;
