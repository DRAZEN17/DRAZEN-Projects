import express from "express";

const app = express();
const PORT = 4000;

app.get("/", (req, res) => {
    res.send("DRAZIME'S API is alive.");
});

app.get("/api/health", (req, res) => {
    res.json({status: "ok"});
});
app.get("/api/hello/:drazen", (req, res) => {
    const drazen = req.params.drazen;
    res.send(`hello, ${drazen}!`);
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

