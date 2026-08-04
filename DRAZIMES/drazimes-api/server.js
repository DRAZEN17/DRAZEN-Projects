import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import healthRouter from "./routes/health.js";
import userRouter from "./routes/users.js";
import orderRouter from "./routes/orders.js";

const app = express();
const PORT = process.env.PORT || 4000;

connectDB();

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

app.use("/api/health", healthRouter);
app.use("/api/users", userRouter);
app.use("/api/orders", orderRouter);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});



// app.get("/", (req, res) => {
//     res.send("DRAZIME'S API is alive.");
// });
// app.post("/api/echo", (req, res) => {
//     res.json({
//         drazen: req.body
//     });
// });
// });  