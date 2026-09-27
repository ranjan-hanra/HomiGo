const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
require("dotenv").config();

const Professional = require("./model/ProviderModel");

const createDummyProvider = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        const existingProvider = await Professional.findOne({
            email: "provider@test.com"
        });

        if (existingProvider) {
            console.log("Dummy provider already exists");
            process.exit();
        }

        const hashedPassword = await bcrypt.hash(
            "123456",
            10
        );

        const provider = await Professional.create({
            name: "Test Provider",
            email: "provider@test.com",
            password: hashedPassword,
            phoneNo: "9876543210",
            isVerified: true,
            isAvailable: true
        });

        console.log("Dummy provider created:");
        console.log(provider.email);

        process.exit();

    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

createDummyProvider();