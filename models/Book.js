const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
    {
        bname: {
            type: String,
            required: true
        },

        sem: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Book", bookSchema);