const express = require("express");

const router = express.Router();

const providerAuthMiddleware = require("../Middlewares/ProviderAuthMiddleware");

const {
    getAvailability,
    updateAvailability
} = require("../Controllers/ProviderAvailabilityController");


router.get(
    "/",
    providerAuthMiddleware,
    getAvailability
);


router.put(
    "/",
    providerAuthMiddleware,
    updateAvailability
);


module.exports = router;