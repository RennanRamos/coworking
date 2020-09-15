const mongoose = require ("mongoose");

const userSchema = new mongoose.Schema({
    email: {type: String, require: true, unique: true},
    password: {type: String, require: true, minlength: 6},
    resetToken: {type: String},
    expireToken: {type: Date},
    resetTokenConfirmation: {type: String},
    expireTokenConfirmation: {type: Date},
    accountKeyConfirmed: {type: Boolean, default: false},
    admin: {type: Boolean, default: false},
    userName: {type: String, default: ""},
    userBirth: {type: Date, default: ""},
    userCPF: {type: String, default: ""},
    userAddress: {type: String, default: ""},
    userBiography: {type: String, default: ""},
});

module.exports = User = mongoose.model("user", userSchema);