const mongoose = require ("mongoose");

const meetingsSchema = new mongoose.Schema({
    userId: {type: String, required: true},
    userMeetingss: {type: String, required: true},


});