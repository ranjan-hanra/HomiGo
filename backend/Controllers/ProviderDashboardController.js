const {BookingModel} = require("../model/BookingMdel");

const getProviderDashboard = async (req, res) => {

    try {
        const providerId = req.provider._id;

        // All bookings assigned to this provider
        const bookings = await BookingModel.find({
            provider: providerId
        })
            .populate("user", "name email phoneNo")
            .populate("service", "name")
            .sort({ createdAt: -1 });

        // Total bookings
        const totalBookings = bookings.length;

        // Pending bookings
        const pendingBookings = bookings.filter(
            booking => booking.status === "pending"
        ).length;

        // Completed bookings
        const completedBookings = bookings.filter(
            booking => booking.status === "completed"
        ).length;

        // Upcoming bookings
        const upcomingBookings = bookings.filter(
            booking =>
                booking.status === "accepted" ||
                booking.status === "upcoming"
        ).length;

        // Total earnings
        const totalEarnings = bookings
            .filter(
                booking => booking.status === "completed"
            )
            .reduce(
                (total, booking) =>
                    total + Number(booking.totalAmount || 0),
                0
            );

        // Recent bookings
        const recentBookings = bookings
            .slice(0, 5)
            .map(booking => ({
                id: booking._id,
                serviceName: booking.serviceName,
                customerName:
                    booking.user?.name || "Customer",
                bookingDate: booking.bookingDate,
                bookingTime: booking.bookingTime,
                totalAmount: booking.totalAmount,
                status: booking.status
            }));

        return res.status(200).json({
            success: true,

            stats: {
                totalBookings,
                pendingBookings,
                completedBookings,
                upcomingBookings,
                totalEarnings
            },

            recentBookings
        });

    } catch (error) {
        console.error(
            "Provider Dashboard Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to load provider dashboard"
        });
    }
};

module.exports = {
    getProviderDashboard
};