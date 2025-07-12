const express = require("express")
const database = require("../connect")
const ObjectId = require("mongodb").ObjectId

let serviceProviderRoutes = express.Router()

serviceProviderRoutes.route("/serviceProviders").get(async (request, response) => {
    try {
        let db = database.getDb();

        // Get pagination parameters (default: page=1, limit=10)
        let page = parseInt(request.query.page) || 1;
        let limit = parseInt(request.query.limit) || 10;
        let skip = (page - 1) * limit;

        // Aggregation pipeline for fetching service providers with user details
        let serviceProviders = await db.collection("service_providers").aggregate([
            {
                $addFields: {
                    user_id: { $toObjectId: "$user_id" } // Convert user_id to ObjectId
                }
            },
            {
                $lookup: {
                    from: "users", // Ensure this is the correct collection name
                    localField: "user_id",
                    foreignField: "_id",
                    as: "userDetails"
                }
            },
            { $unwind: "$userDetails" }, // Flatten the array
            {
                $project: {
                    "_id": 1,
                    "status": 1,
                    "ratings": 1, // todo rename to rating
                    "services": 1,
                    "user_id": 1,
                    "reviews_count": 1,
                    "userDetails.username": 1,
                    "userDetails.email": 1,
                    "userDetails.phone": 1,
                    "userDetails.address": 1,
                    "userDetails.first_name": 1,
                    "userDetails.last_name": 1
                }
            },
            { $skip: skip },
            { $limit: limit }
        ]).toArray();


        // Get total count for pagination info
        let total = await db.collection("service_providers").countDocuments();
        let totalPages = Math.ceil(total / limit);

        response.json({
            total,
            totalPages,
            currentPage: page,
            limit,
            data: serviceProviders
        });

    } catch (error) {
        console.error("Error fetching service providers:", error);
        response.status(500).json({ message: "Internal Server Error" });
    }
});


/**
 * Description: Get all service providers verified status
 * Request Type: GET 
 * URL: http://localhost:3000/verified/serviceProviders
*/
serviceProviderRoutes.route("/verified/serviceProviders").get(async (request, response) => {
    try {
        let db = database.getDb();

        // Get pagination parameters (default: page=1, limit=10)
        let page = parseInt(request.query.page) || 1;
        let limit = parseInt(request.query.limit) || 10;
        let skip = (page - 1) * limit;

        // Get city from query parameter
        let city = request.query.city;

        // Aggregation pipeline for fetching service providers with user details
        let serviceProviders = await db.collection("service_providers").aggregate([
            {
                $match: { status: "verified" } // Match documents based on verified status
            },
            {
                $addFields: {
                    user_id: { $toObjectId: "$user_id" } // Convert user_id to ObjectId
                }
            },
            {
                $lookup: {
                    from: "users", // Ensure this is the correct collection name
                    localField: "user_id",
                    foreignField: "_id",
                    as: "userDetails"
                }
            },
            { $unwind: "$userDetails" }, // Flatten the array
            {
                $project: {
                    "_id": 1,
                    "status": 1,
                    "ratings": 1, // todo rename to rating
                    "services": 1,
                    "reviews_count": 1,
                    "hourly_rate": 1,
                    "userDetails.username": 1,
                    "userDetails.email": 1,
                    "userDetails.first_name": 1,
                    "userDetails.last_name": 1,
                    "userDetails.phone": 1,
                    "userDetails.address": 1
                }
            },
            { $skip: skip },
            { $limit: limit }
        ]).toArray();
    console.log(serviceProviders);
     // Get total count for pagination info
     let total = await db.collection("service_providers").countDocuments();
     let totalPages = Math.ceil(total / limit);

     response.json({
         total,
         totalPages,
         currentPage: page,
         limit,
         data: serviceProviders
     });

 } catch (error) {
     console.error("Error fetching service providers:", error);
     response.status(500).json({ message: "Internal Server Error" });
 }
});
        

// // PATCH endpoint to update a service provider's status
// serviceProviderRoutes.put("/serviceProviders/:id", async (req, res) => {
//     try {
        
//       const { status } = req.body; // expecting { status: "verified" }
//       console.log("Received ID:", req.params.id);
//       console.log("status", status);
//       const updatedWorker = await serviceProvider.findByIdAndUpdate(
//         req.params.id,
//         { $set: { status } }, // Use $set to update only the status field
//         { new: true } // Return the updated document
//       );
//       if (!updatedWorker) {
//         return res.status(404).json({ error: "Worker not found" });
//       }
//       res.json({ data: updatedWorker });
//     } catch (err) {
//       res.status(500).json({ error: err.message });
//     }
//   });



serviceProviderRoutes.put("/serviceProviders/:id", async (req, res) => {
    try {
      const { status } = req.body; // expecting { status: "verified" }
      
      let db = database.getDb();
      
      // Use updateOne to update the status field of the matching document
      const result = await db.collection("service_providers").updateOne(
        { _id: new ObjectId(req.params.id) },
        { $set: { status } }
      );
      
      if (result.matchedCount === 0) {
        return res.status(404).json({ error: "Worker not found" });
      }
      
      // Optionally, retrieve the updated document
      const updatedWorker = await db.collection("service_providers").findOne({ _id: new ObjectId(req.params.id) });
      
      res.json({ data: updatedWorker });
    } catch (err) {
      console.error("Error updating worker:", err);
      res.status(500).json({ error: err.message });
    }
  });
  


//////////////////////////////////////////////////////////////////////////
// Create Routes
//////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////
// Update Routes
//////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////
// Delete Routes
//////////////////////////////////////////////////////////////////////////


//========================================================================
module.exports = serviceProviderRoutes