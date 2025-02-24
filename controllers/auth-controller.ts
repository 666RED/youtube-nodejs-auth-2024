import User from "../models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// register controller
export const registerUser = async (req, res) => {
	try {
		const { username, email, password, role } = req.body;

		// check if the user is already existed in db
		const checkExistingUser = await User.findOne({
			$or: [{ username }, { email }],
		});

		if (checkExistingUser) {
			return res.status(400).json({
				success: false,
				message:
					"User is already exists with either same username or same email",
			});
		}

		// hash user password
		const salt = await bcrypt.genSalt(10); // default is 10
		const hashedPassword = await bcrypt.hash(password, salt);

		// create a new user & save in db
		const newlyCreatedUser = new User({
			username,
			email,
			password: hashedPassword,
			role: role || "user",
		});

		await newlyCreatedUser.save();

		if (newlyCreatedUser) {
			res.status(201).json({
				success: true,
				message: "User registered successfully",
			});
		} else {
			res.status(400).json({
				success: false,
				message: "Unable to register the user",
			});
		}
	} catch (err) {
		console.error(err);
		res.status(500).json({
			success: false,
			message: "An unknown error occurred",
		});
	}
};

// login controller
export const loginUser = async (req, res) => {
	try {
		const { username, password } = req.body;

		const user = await User.findOne({ username });

		// user not registered yet
		if (!user) {
			return res.status(400).json({
				success: false,
				message: "User doesn't exist",
			});
		}

		const isPasswordMatched = await bcrypt.compare(password, user.password);

		if (!isPasswordMatched) {
			return res.status(400).json({
				success: false,
				message: "Invalid credentials",
			});
		}

		// create token
		const accessToken = await jwt.sign(
			// information that you wanna store in the token
			{
				userId: user._id,
				username: user.username,
				role: user.role,
			},
			// secret key
			process.env.JWT_SECRET_KEY
			// optional information
			// {
			// 	expiresIn: "30m",
			// }
		);

		res.status(200).json({
			success: true,
			message: "Logged in successfully",
			accessToken,
		});
	} catch (err) {
		console.error(err);
		res.status(500).json({
			success: false,
			message: "An unknown error occurred",
		});
	}
};

export const changePassword = async (req, res) => {
	try {
		const userId = req.userInfo.userId;

		// extract old and new password
		const { oldPassword, newPassword } = req.body;

		const user = await User.findById(userId);

		if (!user) {
			return res.status(400).json({
				success: false,
				message: "User not found",
			});
		}

		// check if old password is correct
		const isPasswordMatched = await bcrypt.compare(oldPassword, user.password);
		if (!isPasswordMatched) {
			return res.status(400).json({
				success: false,
				message: "Old password is not correct",
			});
		}

		// hash the new password
		const salt = await bcrypt.genSalt(10);
		const newHashedPassword = await bcrypt.hash(newPassword, salt);

		// update user password
		user.password = newHashedPassword;

		await user.save();

		res.status(200).json({
			success: true,
			message: "Password changed successfully",
		});
	} catch (err) {
		console.error(err);
		res.status(500).json({
			success: false,
			message: "Something went wrong",
		});
	}
};
