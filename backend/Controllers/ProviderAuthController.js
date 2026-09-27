const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const ProviderModel = require("../model/ProviderModel");

const providerLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        // Find provider
        const provider = await ProviderModel.findOne({
            email: email.toLowerCase()
        });

        if (!provider) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // Check password
        const isPasswordCorrect = await bcrypt.compare(
            password,
            provider.password
        );

        if (!isPasswordCorrect) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // Check provider verification
        if (!provider.isVerified) {
            return res.status(403).json({
                success: false,
                message: "Provider account is not verified"
            });
        }

        // Create provider JWT
        const token = jwt.sign(
            {
                id: provider._id,
                role: "provider"
            },
            process.env.TOKEN_KEY,
            {
                expiresIn: "7d"
            }
        );

        // Store token in HTTP-only cookie
        res.cookie("providerToken", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite:
                process.env.NODE_ENV === "production"
                    ? "none"
                    : "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.status(200).json({
            success: true,
            message: "Provider login successful",

            provider: {
                id: provider._id,
                name: provider.name,
                email: provider.email,
                phoneNo: provider.phoneNo,
                isVerified: provider.isVerified,
                isAvailable: provider.isAvailable
            }
        });

    } catch (error) {
        console.error("Provider Login Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

const getProviderProfile = async (req, res) => {
    try {
        const provider = req.provider;

        return res.status(200).json({
            success: true,
            provider: {
                id: provider._id,
                name: provider.name,
                email: provider.email,
                phoneNo: provider.phoneNo,
                isVerified: provider.isVerified,
                isAvailable: provider.isAvailable
            }
        });

    } catch (error) {
        console.error("Get Provider Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to get provider details"
        });
    }
};

module.exports = {
    providerLogin,getProviderProfile
};