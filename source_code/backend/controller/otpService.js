const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const UserOTPVerification = require("../models/UserOTPVerification");

// Email transporter configuration with validation
const createTransporter = () => {
    // const emailUser = process.env.EMAIL_USER || "parekhbhargav25@gmail.com";
    // const emailPass = process.env.EMAIL_PASS || "rhonpqaxgusbujip";
    const emailUser = process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_PASS;

    if (!emailUser || !emailPass) {
        throw new Error("Email credentials not properly configured");
    }

    const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
            user: emailUser,
            pass: emailPass,
        },
    });

    transporter.verify((error, success) => {
        if (error) {
            console.error("Transporter verification failed with error:", error.message);
            throw error; // Throw the error to catch it below
        } else {
            console.log("Email transporter configured successfully");
        }
    });

    return transporter;
};

let transporter;
try {
    transporter = createTransporter();
} catch (error) {
    console.error("Failed to initialize email transporter with error:", error.message);
    // Don't set transporter, let it remain undefined
}

async function sendOTP(email, userId) {
    try {
        // Validate inputs
        if (!email || !userId) {
            throw new Error("Email and userId are required");
        }

        // Check if transporter is properly initialized
        if (!transporter || typeof transporter.sendMail !== "function") {
            throw new Error("Email service not properly initialized");
        }

        const otp = Math.floor(10000 + Math.random() * 90000).toString(); // 5 digit 
        const hashedOTP = await bcrypt.hash(otp, 10); // hashed otp
        const expiry = new Date(Date.now() + 3 * 60 * 1000);   //3 minutes in db

        const otpRecord = new UserOTPVerification({
            user_id: userId,
            otp: hashedOTP,
            expiry,
        });
        await otpRecord.save();

        const mailOptions = {
            from: process.env.EMAIL_USER || "arshita01625@gmail.com",
            to: email,
            subject: "Your OTP Code",
            text: `Your OTP code is: ${otp}. It is valid for 10 minutes.`,
            html: `
                <h2>OTP Verification</h2>
                <p>Your OTP is: <strong>${otp}</strong></p>
                <p>Valid for 10 minutes.</p>
            `,
        };

        await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.error("Error in sendOTP:", error);
        throw new Error(`Failed to send OTP: ${error.message}`);
    }
}

async function verifyOTP(userId, inputOTP) {
    try {
        // Validate inputs
        if (!userId || !inputOTP) {
            throw new Error("userId and OTP are required");
        }

        const otpRecord = await UserOTPVerification.findOne({ user_id: userId })
            .sort({ createdAt: -1 });

        if (!otpRecord) {
            return { success: false, message: "No OTP found" };
        }

        if (new Date() > otpRecord.expiry) {
            await UserOTPVerification.deleteOne({ _id: otpRecord._id });
            return { success: false, message: "OTP has expired" };
        }

        const isValid = await bcrypt.compare(inputOTP.toString(), otpRecord.otp);
        if (isValid) {
            await UserOTPVerification.deleteOne({ _id: otpRecord._id });
            return { success: true, message: "OTP verified successfully" };
        }
        return { success: false, message: "Invalid OTP" };
    } catch (error) {
        console.error("Error in verifyOTP:", error);
        throw new Error(`Failed to verify OTP: ${error.message}`);
    }
}

module.exports = { sendOTP, verifyOTP };