const express = require("express");

const {
    fetchData
} = require("../controllers/dataController");

const router = express.Router();

// GLOBAL FETCH API
router.post("/fetch", fetchData);

module.exports = router;