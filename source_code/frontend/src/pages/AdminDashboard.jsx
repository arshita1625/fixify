import { useState, useEffect } from "react";
import {
  Box, Typography, Grid, Paper, Toolbar, Card, CardContent, useTheme, useMediaQuery
} from "@mui/material";
import Sidebar from "../components/Sidebar/Sidebar";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import PersonIcon from "@mui/icons-material/Person";
import BuildIcon from "@mui/icons-material/Build";
import StarRateIcon from "@mui/icons-material/StarRate";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

const AdminDashboard = () => {
  const [open, setOpen] = useState(false);
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalWorkers: 0,
    totalReviews: 0,
    growthRate: 0
  });
  const [chartData, setChartData] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const toggleDrawer = () => {
    setOpen(!open);
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  async function fetchDashboardData() {
    try {
      const response = await fetch("http://localhost:3000/dashboardStats", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      // Expecting data to have stats, chartData, recentActivity
      setStats(data.stats);
      setChartData(data.chartData);
      setRecentActivity(data.recentActivity);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  }

  return (
    <Box sx={{
      width: "90%", marginTop: -10, marginLeft: 5, p: 3,
      flexDirection: "column",
      backgroundColor: "#f8f9fa",
      minHeight: "100vh"
    }}>
      <Sidebar open={open} toggleDrawer={toggleDrawer} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: isMobile ? 1 : 3,
          transition: "margin 0.3s",
          marginLeft: open && !isMobile ? "50px" : "60px",
        }}
      >
        <Toolbar />
        <Typography
          variant="h4"
          fontWeight="bold"
          sx={{ mb: isMobile ? 1 : 2, fontSize: isMobile ? "1.5rem" : "2rem" }}
        >
          Welcome to Admin Dashboard
        </Typography>
        <Typography
          variant="body1"
          sx={{ mb: isMobile ? 2 : 4, fontSize: isMobile ? "0.875rem" : "1rem" }}
        >
          Overview of customers, workers, and performance analytics.
        </Typography>

        {/* Stats Cards */}
        <Grid container spacing={isMobile ? 1 : 3}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{
              p: isMobile ? 1 : 2,
              borderRadius: 3,
              boxShadow: 3,
              backgroundColor: "#ffffff"
            }}>
              <CardContent sx={{ textAlign: "center" }}>
                <PersonIcon sx={{ fontSize: isMobile ? 30 : 40, color: "#1976D2" }} />
                <Typography variant="h6">Total Customers</Typography>
                <Typography variant="h4" fontWeight="bold">
                  {stats.totalCustomers}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{
              p: isMobile ? 1 : 2,
              borderRadius: 3,
              boxShadow: 3,
              backgroundColor: "#ffffff"
            }}>
              <CardContent sx={{ textAlign: "center" }}>
                <BuildIcon sx={{ fontSize: isMobile ? 30 : 40, color: "#28A745" }} />
                <Typography variant="h6">Total Workers</Typography>
                <Typography variant="h4" fontWeight="bold">
                  {stats.totalWorkers}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{
              p: isMobile ? 1 : 2,
              borderRadius: 3,
              boxShadow: 3,
              backgroundColor: "#ffffff"
            }}>
              <CardContent sx={{ textAlign: "center" }}>
                <StarRateIcon sx={{ fontSize: isMobile ? 30 : 40, color: "#FFC107" }} />
                <Typography variant="h6">Total Reviews</Typography>
                <Typography variant="h4" fontWeight="bold">
                  {stats.totalReviews}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{
              p: isMobile ? 1 : 2,
              borderRadius: 3,
              boxShadow: 3,
              backgroundColor: "#ffffff"
            }}>
              <CardContent sx={{ textAlign: "center" }}>
                <TrendingUpIcon sx={{ fontSize: isMobile ? 30 : 40, color: "#FF5733" }} />
                <Typography variant="h6">Growth Rate</Typography>
                <Typography variant="h4" fontWeight="bold">
                  {stats.growthRate}%
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Chart Section */}
        <Grid container spacing={isMobile ? 1 : 3} sx={{ mt: isMobile ? 2 : 4 }}>
          <Grid item xs={12} md={8}>
            <Paper sx={{
              p: isMobile ? 1 : 3,
              borderRadius: 3,
              boxShadow: 3
            }}>
              <Typography
                variant="h6"
                sx={{ mb: isMobile ? 1 : 2 }}
              >
                Website Analytics
              </Typography>
              <ResponsiveContainer width="100%" height={isMobile ? 200 : 300}>
                <BarChart data={chartData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="users" fill="#1976D2" radius={[5, 5, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper sx={{
              p: isMobile ? 1 : 3,
              borderRadius: 3,
              boxShadow: 3
            }}>
              <Typography variant="h6">Recent Activity</Typography>
              {recentActivity.map((activity, index) => (
                <Typography key={index} sx={{ mt: isMobile ? 0.5 : 1 }}>
                  {activity}
                </Typography>
              ))}
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default AdminDashboard;
