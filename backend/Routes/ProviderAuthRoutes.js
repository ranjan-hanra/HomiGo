const express = require("express");

const router = express.Router();

const {
    providerLogin,getProviderProfile
} = require("../Controllers/ProviderAuthController");

const providerAuthMiddleware = require("../Middlewares/ProviderAuthMiddleware");


router.post(
    "/login",
    providerLogin
);

router.get(
    "/me",
    providerAuthMiddleware,
    getProviderProfile
);

// TEMPORARY TEST ROUTE
// router.get(
//     "/test",
//     providerAuthMiddleware,
//     (req, res) => {

//         res.status(200).json({
//             success: true,
//             message: "Provider authentication working",
//             provider: req.provider
//         });

//     }
// );


module.exports = router;