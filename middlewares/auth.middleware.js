import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env.js";
import User from "../models/user.model.js";

const authorize = async (req, res, next) => {
  try {
    let token = null;

    // Check for token in Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "Unauthorized: Token missing" });
    }

    // Verify and decode token
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log("decoded", decoded)

    // Find the user
    const user = await User.findById(decoded.userIdd);

    if (!user) {
      console.log("User not found for ID:", decoded.userId);
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    req.user = user; // Attach user to request
    next(); // Proceed to next middleware
  } catch (error) {
    res.status(401).json({ message: "Unauthorized", error: error.message });
  }
};

export default authorize;
