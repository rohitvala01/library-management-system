
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const studentRoutes = require("./routes/studentRoutes");
const bookRoutes = require("./routes/bookRoutes");
const issueRoutes = require("./routes/issueRoutes");
const dataRoutes = require("./routes/dataRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/students", studentRoutes);
app.use("/books", bookRoutes);
app.use("/issues", issueRoutes);
app.use("/api/data", dataRoutes);

mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.log(err));

app.get("/", (req, res) => {
    res.send("Library Search API Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});