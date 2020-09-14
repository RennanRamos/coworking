const mongoose = require ("mongoose");

const dataSchema = new mongoose.Schema({
    userId: {type: String, required: true},
    userName: {type: String, required: true},
    userBirth: {type: Date, required: true},
    userCPF: {type: String, required: true},
    userAddress: {type: String, required: true},
    userBiography: {type: String},

});

module.exports = UserData = mongoose.model("userData", dataSchema);