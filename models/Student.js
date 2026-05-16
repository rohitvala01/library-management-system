const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
    {
        fname: {
            type: String,
            required: true
        },

        lname: {
            type: String,
            required: true
        },

        phone: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Student", studentSchema);