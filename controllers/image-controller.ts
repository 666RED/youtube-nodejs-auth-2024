import { uploadToCloudinary } from "../helper/cloudinary-helper";
import Image from "../models/Image";
import fs from "fs";
import cloudinary from "../config/cloudinary";

export const uploadImage = async (req, res) => {
	try {
		// check if file is missing in req
		if (!req.file) {
			res.status(400).json({
				success: false,
				message: "File is required",
			});
		}

		// upload to cloudinary
		const { url, publicId } = await uploadToCloudinary(req.file.path);

		// store the image url & publicId along with the uploaded userId to DB
		const newlyUploadedImage = new Image({
			url,
			publicId,
			uploadedBy: req.userInfo.userId,
		});

		await newlyUploadedImage.save();

		// delete the file from local storage
		fs.unlinkSync(req.file.path);

		res.status(201).json({
			success: true,
			message: "Image uploaded successfully",
			image: newlyUploadedImage,
		});
	} catch (err) {
		console.error(err);

		res.status(500).json({
			success: false,
			message: `Something went wrong`,
		});
	}
};

export const fetchImageController = async (req, res) => {
	try {
		const page = parseInt(req.query.page) || 1;
		const limit = parseInt(req.query.limit) || 5;
		const skip = (page - 1) * limit;

		const sortBy = req.query.sortBy || "createdAt";
		const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;
		const totalImages = await Image.countDocuments();
		const totalPages = Math.ceil(totalImages / limit);

		const sortObj = {};
		sortObj[sortBy] = sortOrder;

		const images = await Image.find().sort(sortObj).skip(skip).limit(limit);

		if (images) {
			return res.status(200).json({
				success: true,
				currentPage: page,
				totalPages,
				totalImages,
				data: images,
			});
		}
	} catch (err) {
		console.error(err);
		res.status(500).json({
			success: false,
			message: "Something went wrong",
		});
	}
};

export const deleteImageController = async (req, res) => {
	try {
		const imageId = req.params.id;
		const userId = req.userInfo.userId;
		const image = await Image.findById(imageId);

		if (!image) {
			return res.status(404).json({
				success: false,
				message: "Image not found",
			});
		}

		// check if this image is uploaded by the current user
		if (image.uploadedBy.toString() !== userId) {
			return res.status(403).json({
				success: false,
				message: "You are not authorized to delete this image",
			});
		}

		// delete image first from cloudinary storage
		await cloudinary.uploader.destroy(image.publicId);

		// delete image in db
		await Image.findByIdAndDelete(imageId);

		res.status(200).json({
			success: true,
			message: "Image deleted successfully",
		});
	} catch (err) {
		console.error(err);
		res.status(500).json({
			success: false,
			message: "Something went wrong",
		});
	}
};
