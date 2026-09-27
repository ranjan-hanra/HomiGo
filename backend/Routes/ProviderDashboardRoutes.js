const express = require("express");

const router = express.Router();

const {
    getProviderDashboard
} = require("../Controllers/ProviderDashboardController");

const providerAuthMiddleware = require("../Middlewares/ProviderAuthMiddleware");

router.get(
    "/",
    providerAuthMiddleware,
    getProviderDashboard
);

module.exports = router;