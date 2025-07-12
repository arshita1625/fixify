const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const serviceSchema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: "user", required: true }, // Reference to User model
  type: [{
    type: String,
    enum: [
      "Plumbing", "Electrical", "Carpentry", "Painting", "Cleaning",
      "HVAC Repair", "Gardening", "Pest Control", "Roofing", "Masonry",
      "Appliance Repair", "Flooring", "Locksmith", "Window Cleaning",
      "Handyman", "Drywall Repair", "Tile Work", "Furniture Assembly",
      "Pressure Washing", "Pool Maintenance"
    ],
    required: true
  }],
  description: { type: String, trim: true, required: true },
  hourly_rate: { type: Number, required: true, min: 0 }
}, { timestamps: true });

module.exports = mongoose.model("service", serviceSchema, "services");

// a particular user offering multiple services and varying rates, like "John's' Plumbing Service", "John's Electrical Service", etc.