const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const serviceProviderSchema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: "user", required: true }, // Reference to User model
  status: { type: String, enum: ["pending", "verified"], required: true },
  services: [{
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
  hourly_rate: { type: Number, required: true, min: 0 },
  availability: {
    Monday: { type: [String], default: [] },
    Tuesday: { type: [String], default: [] },
    Wednesday: { type: [String], default: [] },
    Thursday: { type: [String], default: [] },
    Friday: { type: [String], default: [] },
    Saturday: { type: [String], default: [] },
    Sunday: { type: [String], default: [] }
  },
  ratings: { type: Number, min: 0, max: 5, default: 0 }, // Ratings between 0 and 5
  reviews_count: { type: Number, default: 0 } // Default is 0
}, { timestamps: true });

module.exports = mongoose.model("serviceProvider", serviceProviderSchema, "service_providers");
// a service provider's profile