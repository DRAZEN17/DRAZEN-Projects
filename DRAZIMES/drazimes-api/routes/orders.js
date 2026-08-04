import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
    res.json({ message: "order routes coming soon" });
});


export default router;

// router.get("/ping", (req, res) => {
//     res.json({ pong: true });
// });