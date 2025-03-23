import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import Redis from "ioredis";
import nodemailer from "nodemailer";
import authRoutes from "./routes/authRoutes.mjs";

dotenv.config();
const app = express();


app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose
    .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log(" MongoDB Connected"))
    .catch((err) => {
        console.error(" MongoDB Connection Error:", err);
        process.exit(1);
    });

app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
