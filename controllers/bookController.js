const Book = require("../models/Book");

const createBook = async (req, res) => {
    try {

        const book = await Book.create(req.body);

        res.status(201).json(book);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};

module.exports = {
    createBook
};