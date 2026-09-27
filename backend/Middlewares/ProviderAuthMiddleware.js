const jwt = require("jsonwebtoken");
const ProviderModel = require("../model/ProviderModel");

const providerAuthMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies.providerToken;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Provider not authenticated"
            });
        }

        const decoded = jwt.verify(
            token,
            process.env.TOKEN_KEY
        );

        // Make sure this token belongs to a provider
        if (decoded.role !== "provider") {
            return res.status(403).json({
                success: false,
                message: "Provider access only"
            });
        }

        const provider = await ProviderModel.findById(
            decoded.id
        ).select("-password");

        if (!provider) {
            return res.status(401).json({
                success: false,
                message: "Provider not found"
            });
        }

        // Attach provider to request
        req.provider = provider;

        next();

    } catch (error) {
        console.error("Provider Auth Error:", error);

        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({
                success: false,
                message: "Invalid provider token"
            });
        }

        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                success: false,
                message: "Provider session expired"
            });
        }

        return res.status(500).json({
            success: false,
            message: "Authentication failed"
        });
    }
};

module.exports = providerAuthMiddleware;