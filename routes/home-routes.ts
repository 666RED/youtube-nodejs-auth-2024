import express from "express";
import authMiddleware from "../middleware/auth-middleware";

const router = express.Router();

router.get("/welcome", authMiddleware, (req, res) => {
	const { username, userId, role } = req.userInfo;

	res.json({
		message: "Welcome to home page",
		user: {
			_id: userId,
			username,
			role,
		},
	});
});

export default router;
