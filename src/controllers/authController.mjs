import redisConfig from "../config/redisConfig.mjs"; // Import Redis client
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import User from "../models/User.mjs"; // Adjust path based on your project
import admin from "../config/firebaseAdmin.mjs"; //firebase


dotenv.config();

//  Configure Nodemailer for Email OTP
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  
 
//  Predefined Admin Emails & Phone Numbers
const adminEmails = ["bhoyarriddhi@gmail.com"]; // Add real admin emails
const adminPhones = ["+917066630541"]; // Add real admin phone numbers

//  Helper functions to interact with Redis securely
const storeOTP = async (key, otp) => {
    try {
        await redisClient.setEx(`otp:${key}`, 300, otp); // 5 min expiry
    } catch (err) {
        console.error(" Redis Store OTP Error:", err);
    }
};

const getOTP = async (key) => {
    try {
        return await redisClient.get(`otp:${key}`);
    } catch (err) {
        console.error(" Redis Get OTP Error:", err);
        return null;
    }
};

const deleteOTP = async (key) => {
    try {
        await redisClient.del(`otp:${key}`);
    } catch (err) {
        console.error(" Redis Delete OTP Error:", err);
    }
};

//  Sign-Up (Full Name & Email)
export const signUp = async (req, res) => {
    try {
        const { fullName, email } = req.body;

        if (!fullName || !email) {
            return res.status(400).json({ message: " Full Name and Email are required." });
        }

        let existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: " User already exists." });
        }

        //  Auto-assign Role (Admin or User)
        const role = adminEmails.includes(email) ? "admin" : "user";

        const newUser = new User({ fullName, email, role });
        await newUser.save();

        res.status(201).json({ message: ` Registered successfully. Please verify OTP.` });
    } catch (err) {
        res.status(500).json({ message: " Server Error" });
    }
};

//  Send OTP via Email for Login
export const sendEmailOTP = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: " User not found" });

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        await storeOTP(email, otp);

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: { user: process.env.EMAIL_USER },
        });

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Your OTP",
            text: `Your OTP is: ${otp}. It expires in 5 minutes.`,
        });

        res.json({ message: " OTP sent to email" });
    } catch (err) {
        res.status(500).json({ message: " Error sending OTP" });
    }
};

//  Verify Email OTP & Login
export const verifyEmailOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const storedOTP = await getOTP(email);

        if (!storedOTP || storedOTP !== otp)
            return res.status(400).json({ message: " Invalid or expired OTP" });

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: " User not found" });

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

        await deleteOTP(email);
        res.json({ token, role: user.role });
    } catch (err) {
        res.status(500).json({ message: " Server error" });
    }
};
//  Send Phone OTP via Firebase
export const sendPhoneOTP = async (req, res) => {
    try {
        const { phoneNumber } = req.body;

        if (!phoneNumber) {
            return res.status(400).json({ message: " Phone number is required." });
        }

        // Firebase sends OTP automatically via frontend SDK
        res.json({ message: " Request received. OTP will be sent by Firebase." });
    } catch (err) {
        res.status(500).json({ message: " Error processing OTP request." });
    }
};

//  Verify Phone OTP & Login (Firebase)
export const verifyPhoneOTP = async (req, res) => {
    try {
        const { idToken } = req.body;

        // Verify OTP Token from Firebase
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const phoneNumber = decodedToken.phone_number;

        if (!phoneNumber) {
            return res.status(400).json({ message: " Invalid OTP or Phone Number" });
        }

        // Find or Create User
        let user = await User.findOne({ phoneNumber });
        if (!user) {
            user = new User({ phoneNumber, role: "user" });
            await user.save();
        }

        // Generate JWT Token
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.json({ message: " OTP Verified Successfully", token, role: user.role });
    } catch (err) {
        res.status(401).json({ message: " Invalid OTP", error: err.message });
    }
};
