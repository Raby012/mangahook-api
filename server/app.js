const ApiKey = require("./middleware/apiKeyMiddleware");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");

const mangaRouter = require("./routes/mangaRouter");
const mangaListRouter = require("./routes/mangaListRouter");
const mangaSearch = require("./routes/mangaSearch");

require("dotenv").config();

// Middleware
app.use(bodyParser.json());
app.use(ApiKey);

// Routes (DON’T change these)
app.use("/api/manga", mangaRouter);
app.use("/api/mangaList", mangaListRouter);
app.use("/api/search", mangaSearch);

// Root test route (optional but useful)
app.get("/", (req, res) => {
    res.send("MangaHook API Running 🚀");
});

// IMPORTANT FIX (port + termux access)
const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});
