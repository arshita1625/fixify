const express = require("express")
const database = require("../connect")
const ObjectId = require("mongodb").ObjectId

let dashboardStatRoute = express.Router()

dashboardStatRoute.route("/dashboardStats").get(async (request, response) => {
  try {
    let db = database.getDb();

    // Total counts
    const totalWorkers = await db.collection("service_providers").countDocuments();
    const totalUsers = await db.collection("users").countDocuments();
    const totalCustomers = await db.collection("users").countDocuments({ role: "consumer" });

    // Sum total reviews from service_providers collection
    const reviewSumResult = await db.collection("service_providers").aggregate([
      { $group: { _id: null, totalReviews: { $sum: "$reviews_count" } } }
    ]).toArray();
    const totalReviews = reviewSumResult[0] ? reviewSumResult[0].totalReviews : 0;

    // Calculate growth rate based on new user signups in the last 7 days by going to the past date
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const newUsersCount = await db.collection("users").countDocuments({ createdAt: { $gte: oneWeekAgo } });
    const growthRate = totalUsers ? ((newUsersCount / totalUsers) * 100).toFixed(2) : 0;

    // Chart data: monthly user signups aggregation (assuming 'createdAt' exists in users)
    const chartData = await db.collection("users").aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%b", date: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          name: "$_id",
          users: "$count"
        }
      },
      { $sort: { name: 1 } }
    ]).toArray();

    // Recent activity: new customers, new workers, and deactivated workers in the last 7 days
    const newCustomers = await db.collection("users").countDocuments({ createdAt: { $gte: oneWeekAgo } });
    const newWorkers = await db.collection("service_providers").countDocuments({ createdAt: { $gte: oneWeekAgo } });
    const deactivatedWorkers = await db.collection("service_providers").countDocuments({
      status: "deactivated",
      createdAt: { $gte: oneWeekAgo }
    });

    const recentActivity = [
      `${newCustomers} new customers signed up`,
      `${newWorkers} new workers registered`,
      `${deactivatedWorkers} workers deactivated`
    ];

    response.json({
      stats: {
        totalCustomers,
        totalWorkers,
        totalReviews,
        growthRate
      },
      chartData,
      recentActivity
    });

  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    response.status(500).json({ message: "Internal Server Error" });
  }
});


module.exports = dashboardStatRoute

//builds a real time dashboard