import express from "express";
import authMiddleware from "../middleware/auth-middleware";
import adminMiddleware from "../middleware/admin-middleware";
import {
	deleteImageController,
	fetchImageController,
	uploadImage,
} from "../controllers/image-controller";
import uploadMiddleware from "../middleware/upload-middleware";

const router = express.Router();

// upload image
router.post(
	"/upload",
	authMiddleware,
	adminMiddleware,
	uploadMiddleware.single("image"),
	uploadImage
);

// get all the images
router.get("/get", authMiddleware, fetchImageController);

// delete single image
router.delete(
	"/delete/:id",
	authMiddleware,
	adminMiddleware,
	deleteImageController
);

export default router;
