const BookIssue = require("../models/BookIssue");

const fetchData = async (req, res) => {
    try {

        const { search, issue_date, sub_date } = req.body;

        let matchStage = {};


        // DATE FILTER LOGIC

        // BOTH DATES RANGE (ISS + SUB)
        if (issue_date && sub_date) {

            const start = new Date(issue_date);
            const end = new Date(sub_date);

            start.setHours(0, 0, 0, 0);
            end.setHours(23, 59, 59, 999);

            matchStage = {
                $or: [
                    {
                        iss_date: {
                            $gte: start,
                            $lte: end
                        }
                    },
                    {
                        sub_date: {
                            $gte: start,
                            $lte: end
                        }
                    }
                ]
            };
        }

        // ONLY ISSUE DATE - EXACT DATE
        else if (issue_date) {

            const date = new Date(issue_date);
            date.setHours(0, 0, 0, 0);

            const nextDate = new Date(date);
            nextDate.setDate(nextDate.getDate() + 1);

            matchStage.iss_date = {
                $gte: date,
                $lt: nextDate
            };
        }

        // ONLY SUB DATE - EXACT DATE
        else if (sub_date) {

            const date = new Date(sub_date);
            date.setHours(0, 0, 0, 0);

            const nextDate = new Date(date);
            nextDate.setDate(nextDate.getDate() + 1);

            matchStage.sub_date = {
                $gte: date,
                $lt: nextDate
            };
        }

        const data = await BookIssue.aggregate([

            // DATE FILTER
            { $match: matchStage },

            // STUDENT JOIN
            {
                $lookup: {
                    from: "students",
                    localField: "s_id",
                    foreignField: "_id",
                    as: "student"
                }
            },

            // BOOK JOIN
            {
                $lookup: {
                    from: "books",
                    localField: "b_id",
                    foreignField: "_id",
                    as: "book"
                }
            },

            // FLATTEN
            { $unwind: "$student" },
            { $unwind: "$book" },

            // SEARCH FILTER
            {
                $match: search && search.trim() !== ""
                    ? {
                        $or: [
                            {
                                "student.fname": {
                                    $regex: search.trim(),
                                    $options: "i"
                                }
                            },
                            {
                                "student.lname": {
                                    $regex: search.trim(),
                                    $options: "i"
                                }
                            },
                            {
                                "book.bname": {
                                    $regex: search.trim(),
                                    $options: "i"
                                }
                            }
                        ]
                    }
                    : {}
            },

            // GROUP BY STUDENT
            {
                $group: {
                    _id: "$student._id",
                    firstName: { $first: "$student.fname" },
                    lastName: { $first: "$student.lname" },
                    phone: { $first: "$student.phone" },
                    book: {
                        $push: {
                            id: "$book._id",
                            bookName: "$book.bname",
                            sem: "$book.sem"
                        }
                    }
                }
            },

            // FINAL OUTPUT
            {
                $project: {
                    _id: 0,

                    id: "$_id",
                    firstName: 1,
                    lastName: 1,
                    phone: 1,
                    book: 1
                }
            }
        ]);

        // NO DATA
        if (!data || data.length === 0) {
            return res.status(404).json({
                message: "No data found"
            });
        }

        return res.status(200).json({
            message: "Data fetched...",
            data
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};

module.exports = { fetchData };