const { model } = require("mongoose");

const { ProviderSchema } = require("../schemas/ProviderSchema");

const ProviderModel = model("Provider", ProviderSchema);

module.exports = ProviderModel;