import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { connectToDb } from "./database/db";
import authRoutes from "./routes/auth-routes";
import homeRoutes from "./routes/home-routes";
import adminRoutes from "./routes/admin-routes";
import uploadImageRoutes from "./routes/image-routes";

const app = express();

connectToDb();

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/home", homeRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/image", uploadImageRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
	console.log(`Server is now listening to port ${PORT}`);
});
