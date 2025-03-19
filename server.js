const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

// Servire i file statici (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, "public")));

// Route principale
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "page.html"));
});

// Avvio del server
app.listen(PORT, () => {
    console.log(`Server avviato su http://localhost:${PORT}`);
});