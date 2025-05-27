import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import Redis from "ioredis";
import nodemailer from "nodemailer";
import authRoutes from "./routes/authRoutes.mjs";
import restaurantRoutes from "./routes/restaurantRoutes.mjs"; // Import restaurant routes
import itemRoutes from "./routes/itemRoutes.mjs"
import paymentRoutes from "./routes/paymentRoutes.mjs"
import { fileURLToPath } from 'url';
import path from 'path';


dotenv.config();
const app = express();



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


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
app.use("/api/restaurants", restaurantRoutes); // Add restaurant routes
app.use("/api/items", itemRoutes); // Register Item Routes
app.use("/api/payment", paymentRoutes); //Payment routes

// ✅ Serve invoice PDFs from /invoices directory
app.use('/invoices', express.static(path.join(__dirname, 'invoices')));


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
