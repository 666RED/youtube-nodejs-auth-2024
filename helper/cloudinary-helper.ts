// when use this, it will set the config & initialize
import cloudinary from "../config/cloudinary";

export const uploadToCloudinary = async (filePath) => {
	try {
		const result = await cloudinary.uploader.upload(filePath);

		return {
			url: result.secure_url,
			publicId: result.public_id,
		};
	} catch (err) {
		console.error(`Error while uploading to cloudinary ${err}`);
		throw new Error("Error while uploading to cloudinary");
	}
};
