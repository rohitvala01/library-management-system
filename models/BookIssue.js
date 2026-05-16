const mongoose = require("mongoose");

const bookIssueSchema = new mongoose.Schema(
    {
        s_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Student",
            required: true
        },

        b_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Book",
            required: true
        },

        iss_date: {
            type: Date,
            required: true
        },

        sub_date: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("BookIssue", bookIssueSchema);