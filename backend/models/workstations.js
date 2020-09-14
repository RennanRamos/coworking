const mongoose = require ("mongoose");

const workstationSchema = new mongoose.Schema({
    userId: {type: String, required: true},
    userWorkstations: {type: String, required: true},


});