const BookIssue = require("../models/BookIssue");

const createIssue = async (req, res) => {
    try {

        const { iss_date, sub_date, s_id, b_id } = req.body;

        // 1. required fields check
        if (!iss_date || !sub_date || !s_id || !b_id) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        const today = new Date();
        const inputIssueDate = new Date(iss_date);
        const inputSubDate = new Date(sub_date);

        // 2. invalid date check
        if (isNaN(inputIssueDate) || isNaN(inputSubDate)) {
            return res.status(400).json({
                message: "Invalid date format"
            });
        }

        today.setHours(0, 0, 0, 0);
        inputIssueDate.setHours(0, 0, 0, 0);
        inputSubDate.setHours(0, 0, 0, 0);

        // 3. future issue date
        if (inputIssueDate > today) {
            return res.status(400).json({
                message: "Issue date cannot be in future"
            });
        }

        // 4. sub date must be after issue date
        if (inputSubDate < inputIssueDate) {
            return res.status(400).json({
                message: "Submission date must be after issue date"
            });
        }

        // 5. max 30 days rule
        const diffDays = (inputSubDate - inputIssueDate) / (1000 * 60 * 60 * 24);

        if (diffDays > 30) {
            return res.status(400).json({
                message: "Book cannot be issued for more than 30 days"
            });
        }

        const issue = await BookIssue.create(req.body);

        res.status(201).json(issue);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = { createIssue };