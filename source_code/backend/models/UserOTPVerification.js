// models/userOTPVerification.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userOTPVerificationSchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'user', // Assuming you have a User model
        required: true,
        index: true // Adding index for faster queries
    },
    otp: {
        type: String,
        required: true
    },
    expiry: {
        type: Date,
        required: true,
        index: { expires: '3m' } // Auto-delete after 10 minutes
    }
}, {
    timestamps: true,
    collection: 'user_otp_verifications'
});

const UserOTPVerification = mongoose.model('UserOTPVerification', userOTPVerificationSchema);

module.exports = UserOTPVerification;