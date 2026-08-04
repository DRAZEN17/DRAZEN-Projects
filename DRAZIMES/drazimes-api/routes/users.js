import express from "express";
import User from "../models/User.js";

const router = express.Router();

router.post("/signup", async (req, res) => {
    try {
        const { name, email, password, bio } = req.body;
        const user = await User.create({ name, email, password, bio });
        res.status(201).json(user);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.get("/", async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
        return res.status(404).json({
            message: "User not found"
        });
        }

        res.json(user);
    } catch (err) {
        res.status(500).json({
        error: err.message
        });
    }
});

export default router;