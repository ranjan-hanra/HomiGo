const express = require("express");

const router = express.Router();

const providerAuthMiddleware = require("../Middlewares/ProviderAuthMiddleware");

const {
    getAvailableBookings,
    acceptBooking,
    getMyBookings,
    updateBookingStatus
} = require("../Controllers/ProviderBookingController");


// Available bookings
router.get(
    "/available",
    providerAuthMiddleware,
    getAvailableBookings
);


// Accept booking
router.put(
    "/:bookingId/accept",
    providerAuthMiddleware,
    acceptBooking
);


// Provider's bookings
router.get(
    "/my-bookings",
    providerAuthMiddleware,
    getMyBookings
);


// Update booking status
router.put(
    "/:bookingId/status",
    providerAuthMiddleware,
    updateBookingStatus
);


module.exports = router;