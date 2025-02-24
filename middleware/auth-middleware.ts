import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
	const authHeader = req.headers["authorization"];
	const token = authHeader && authHeader.split(" ")[1]; // get token (exclude Bearer)

	if (!token) {
		return res.status(401).json({
			success: false,
			message: "Access denied, no token provided. Please login again",
		});
	}

	// decode token
	try {
		const decodedTokenInfo = jwt.verify(token, process.env.JWT_SECRET_KEY); // use secret key to decode the token & get the info

		req.userInfo = decodedTokenInfo;

		next();
	} catch (err) {
		console.error(err);
		return res.status(500).json({
			success: false,
			message: "Something went wrong, please login again",
		});
	}
};

export default authMiddleware;
