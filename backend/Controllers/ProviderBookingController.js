const { BookingModel } = require("../model/BookingMdel");


// Get bookings available for providers
const getAvailableBookings = async (req, res) => {
    try {
        const bookings = await BookingModel.find({
            provider: null,
            status: "pending"
        })
            .populate("user", "name email phoneNo")
            .populate("service", "name")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            bookings
        });

    } catch (error) {
        console.error("Get Available Bookings Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch available bookings",
            error: error.message
        });
    }
};


// Accept booking
// This route is kept for compatibility.
// It can also update amount/payment information.
const acceptBooking = async (req, res) => {
    try {
        const { bookingId } = req.params;
        const provider = req.provider;

        const {
            amount,
            paymentStatus
        } = req.body || {};

        // Check provider availability only when taking
        // an unassigned booking
        const existingBooking = await BookingModel.findById(bookingId);

        if (!existingBooking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found"
            });
        }

        // ------------------------------------------------
        // CASE 1:
        // Booking is already assigned to this provider
        // Use this route to update amount/payment
        // ------------------------------------------------
        if (
            existingBooking.provider &&
            existingBooking.provider.toString() === provider._id.toString()
        ) {

            const updateData = {};

            if (amount !== undefined) {
                const numericAmount = Number(amount);

                if (!Number.isFinite(numericAmount) || numericAmount < 0) {
                    return res.status(400).json({
                        success: false,
                        message: "Invalid booking amount"
                    });
                }

                updateData.totalAmount = numericAmount;
            }

            if (paymentStatus !== undefined) {

                const allowedPaymentStatuses = [
                    "pending",
                    "paid",
                    "failed",
                    "refunded"
                ];

                if (!allowedPaymentStatuses.includes(paymentStatus)) {
                    return res.status(400).json({
                        success: false,
                        message: "Invalid payment status"
                    });
                }

                updateData.paymentStatus = paymentStatus;
            }

            const booking = await BookingModel.findOneAndUpdate(
                {
                    _id: bookingId,
                    provider: provider._id
                },
                updateData,
                {
                    returnDocument: "after",
                    runValidators: true
                }
            )
                .populate("user", "name email phoneNo")
                .populate("service", "name");

            return res.status(200).json({
                success: true,
                message: "Booking updated successfully",
                booking
            });
        }


        // ------------------------------------------------
        // CASE 2:
        // Booking is still unassigned
        // Provider accepts it
        // ------------------------------------------------

        if (!provider.isAvailable) {
            return res.status(403).json({
                success: false,
                message: "You are currently unavailable for bookings"
            });
        }

        const updateData = {
            provider: provider._id,
            status: "accepted"
        };


        // Optional amount
        if (amount !== undefined) {

            const numericAmount = Number(amount);

            if (!Number.isFinite(numericAmount) || numericAmount < 0) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid booking amount"
                });
            }

            updateData.totalAmount = numericAmount;
        }


        // Optional payment status
        if (paymentStatus !== undefined) {

            const allowedPaymentStatuses = [
                "pending",
                "paid",
                "failed",
                "refunded"
            ];

            if (!allowedPaymentStatuses.includes(paymentStatus)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid payment status"
                });
            }

            updateData.paymentStatus = paymentStatus;
        }


        const booking = await BookingModel.findOneAndUpdate(
            {
                _id: bookingId,
                provider: null,
                status: "pending"
            },
            updateData,
            {
                returnDocument: "after",
                runValidators: true
            }
        )
            .populate("user", "name email phoneNo")
            .populate("service", "name");


        if (!booking) {
            return res.status(409).json({
                success: false,
                message: "Booking is no longer available"
            });
        }


        res.status(200).json({
            success: true,
            message: "Booking accepted successfully",
            booking
        });

    } catch (error) {
        console.error("Accept/Update Booking Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to update booking",
            error: error.message
        });
    }
};


// Get provider's own bookings
const getMyBookings = async (req, res) => {
    try {
        const providerId = req.provider._id;

        const bookings = await BookingModel.find({
            provider: providerId
        })
            .populate("user", "name email phoneNo")
            .populate("service", "name")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            bookings
        });

    } catch (error) {
        console.error("Get My Bookings Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch your bookings",
            error: error.message
        });
    }
};


// Update booking status
const updateBookingStatus = async (req, res) => {
    try {
        const { bookingId } = req.params;
        const { status } = req.body;
        const providerId = req.provider._id;

        const allowedStatuses = [
            "in_progress",
            "completed",
            "cancelled"
        ];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid booking status"
            });
        }

        // Find booking belonging to this provider
        const booking = await BookingModel.findOne({
            _id: bookingId,
            provider: providerId
        });

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found"
            });
        }

        // IMPORTANT:
        // Provider cannot complete an unpaid booking
        if (
            status === "completed" &&
            booking.paymentStatus !== "paid"
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Payment must be completed before the task can be marked as completed."
            });
        }

        // Update status
        booking.status = status;

        await booking.save();

        return res.status(200).json({
            success: true,
            message: `Booking marked as ${status}`,
            booking
        });

    } catch (error) {
        console.error("Update Booking Status Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to update booking status",
            error: error.message
        });
    }
};


module.exports = {
    getAvailableBookings,
    acceptBooking,
    getMyBookings,
    updateBookingStatus
};