const ProviderModel = require("../model/ProviderModel");

// Get current availability
const getAvailability = async (req, res) => {
    try {
        const provider = await ProviderModel
            .findById(req.provider._id)
            .select("isAvailable");

        if (!provider) {
            return res.status(404).json({
                success: false,
                message: "Provider not found"
            });
        }

        res.status(200).json({
            success: true,
            isAvailable: provider.isAvailable
        });

    } catch (error) {
        console.error("Get Availability Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to get availability",
            error: error.message
        });
    }
};


// Change availability
const updateAvailability = async (req, res) => {
    try {
        const { isAvailable } = req.body;

        if (typeof isAvailable !== "boolean") {
            return res.status(400).json({
                success: false,
                message: "isAvailable must be true or false"
            });
        }

        const provider = await ProviderModel.findByIdAndUpdate(
            req.provider._id,
            {
                isAvailable
            },
            {
                returnDocument: "after"
            }
        ).select("name email isAvailable");

        if (!provider) {
            return res.status(404).json({
                success: false,
                message: "Provider not found"
            });
        }

        res.status(200).json({
            success: true,
            message: isAvailable
                ? "You are now available for bookings"
                : "You are now unavailable for bookings",
            isAvailable: provider.isAvailable
        });

    } catch (error) {
        console.error("Update Availability Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to update availability",
            error: error.message
        });
    }
};


module.exports = {
    getAvailability,
    updateAvailability
};