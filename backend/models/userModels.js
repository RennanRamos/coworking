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
});

module.exports = User = mongoose.model("user", userSchema);