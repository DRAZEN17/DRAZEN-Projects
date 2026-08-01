import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
    res.json({ status: "ok" });
});

router.get("/time", (req, res) => {
    res.json({
    now: new Date().toISOString()});
});


export default router;