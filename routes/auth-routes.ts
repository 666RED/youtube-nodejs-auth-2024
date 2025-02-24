import express from "express";
import {
	changePassword,
	loginUser,
	registerUser,
} from "../controllers/auth-controller";
import authMiddleware from "../middleware/auth-middleware";

const router = express.Router();

// all routes are related to authentication & authorization

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/change-password", authMiddleware, changePassword);

export default router;
