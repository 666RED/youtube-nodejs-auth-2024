import mongoose from "mongoose";

export const connectToDb = async () => {
	try {
		await mongoose.connect(process.env.MONGODB_CREDENTIAL);
		console.log("MongoDB connected successfully");
	} catch (err) {
		console.error("MongoDB connection failed:", err);
		process.exit(1);
	}
};
