import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// Middleware to verify JWT token and extract user role
// export const verifyToken = (req, res, next) => {
//     const token = req.headers.authorization?.split(" ")[1]; // Extract token from "Bearer <token>"

//     if (!token) {
//         return res.status(401).json({ message: "Unauthorized. No token provided." });
//     }

//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         req.user = decoded; // Attach user data to request object
//         next(); // Move to the next middleware/route
//     } catch (error) {
//         return res.status(403).json({ message: "Invalid or expired token." });
//     }
// };

export const verifyToken = (req, res, next) => {
    console.log("Authorization Header:", req.headers.authorization); // Debug log

    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "Unauthorized. No token provided." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded Token:", decoded); // Debug log
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({ message: "Invalid or expired token." });
    }
};




// Middleware to check if user is admin
export const verifyAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== "admin") {
        return res.status(403).json({ message: "Access denied. Admins only." });
    }
    next();
};
