const jwt = require("jsonwebtoken");
const Admin = require('../models/Admin/adminModel');

const adminOnly = (requiredRoles) => {
    return async (req, res, next) => {
        const adminToken = req.cookies.adminToken;
        
        if (!adminToken) {
            return res.status(401).json({ message: "No access token!" });
        }

        try {
            const decoded = jwt.verify(adminToken, process.env.SECRET);
            const admin = await Admin.findById(decoded._id);

            if (!admin) {
                return res.status(401).json({ message: "Admin not found" });
            }

            // Check if the admin's role matches one of the required roles
            if (!requiredRoles.includes(admin.role)) {
                return res.status(403).json({ message: `Access denied. Only ${requiredRoles.join(", ")} are allowed.` });
            }

            if (!admin.isVerified) {
                return res.status(403).json({ message: "Please verify your account first!" });
            }

            req.user = admin;  // Attach the admin user to the request object for later use
            next();  // Proceed to the next middleware or route handler
        } catch (error) {
            console.error('Token verification error:', error);
            if (error instanceof jwt.JsonWebTokenError) {
                return res.status(401).json({ message: "Invalid token" });
            }
            res.status(500).json({ message: "Internal server error" });
        }
    };
};

module.exports = adminOnly;
