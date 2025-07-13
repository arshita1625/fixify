import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import {
  Container,
  Paper,
  Avatar,
  Typography,
  TextField,
  Button,
  Box,
  Grid,
  IconButton,
  Modal,
  Card,
  CardContent
} from "@mui/material";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import axios from "axios";

const WorkerProfile = () => {
  const { user, setUser } = useContext(AuthContext);
  const { isAuthenticated } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    username: "",
    name: "",
    lastName: "",
    phone: "",
    email: "",
    addressln1: "",
    province: "",
    postalCode: ""
  });
  const [isEditing, setIsEditing] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    console.log("User:", user);
    if (user) {
      setFormData({
        username: user.username || "",
        name: user.first_name || "",
        lastName: user.last_name || "",
        phone: user.phone || "",
        email: user.email || "",
        addressln1: user.address?.line1 || "",
        province: user.address?.province || "",
        postalCode: user.address?.postal_code || ""
      });

      // Fetch reviews for the worker.
      const fetchReviews = async () => {
        try {
          // Adjust the endpoint as needed.
          const response = await axios.get(`http://localhost:3000/reviews/worker-reviews/${user.id}`);
          if (response.data.success) {
            setReviews(response.data.reviews);
          }
        } catch (error) {
          console.error("Error fetching reviews:", error);
        }
      };
      fetchReviews();
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const payload = {
        id: user.id || user._id,
        email: user.email, // Identifier; not editable
        username: formData.username,
        name: formData.name,
        lastName: formData.lastName,
        phone: formData.phone,
        addressln1: formData.addressln1,
        province: formData.province,
        postalCode: formData.postalCode,
      };

      const response = await axios.put("http://localhost:3000/users/update", payload);

      if (response.data.success) {
        console.log("responsee", response);
        // Update both the AuthContext and local storage (if used)
        setUser(response.data.data);
        localStorage.setItem("user", JSON.stringify(response.data.data));
        setIsEditing(false);
        alert("Profile updated successfully!");
      } else {
        alert("Update failed: " + response.data.message);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("An error occurred while updating your profile.");
    }
  };


  return (
    <Container
      maxWidth="xl"
      sx={{
        marginTop: 13,
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        pb: 5
      }}
    >
      <Box sx={{ display: "flex", width: "100%", maxWidth: "1200px", gap: 3 }}>
        {/* Left Side: Profile Picture and Basic Info */}
        <Paper elevation={3} sx={{ padding: 3, width: "30%", textAlign: "center" }}>
          <Box position="relative" display="inline-block">
            <Avatar src="/profile.jpg" sx={{ width: 100, height: 100, margin: "auto" }} />
            <IconButton sx={{ position: "absolute", bottom: 0, right: 10, bgcolor: "white" }}>
              <PhotoCameraIcon color="primary" />
            </IconButton>
          </Box>
          <Typography variant="h6" sx={{ marginTop: 1 }}>
            {formData.name} {formData.lastName}
          </Typography>
        </Paper>

        {/* Right Side: Account Info and Reviews */}
        <Paper elevation={3} sx={{ padding: 3, flexGrow: 1 }}>
          <Box sx={{ marginTop: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  disabled
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="First Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  disabled={!isEditing}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Last Name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  disabled={!isEditing}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Phone Number"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  disabled={!isEditing}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Email Address"
                  name="email"
                  value={formData.email}
                  fullWidth
                  margin="normal"
                  disabled
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Street Address"
                  name="addressln1"
                  value={formData.addressln1}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  disabled={!isEditing}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Province"
                  name="province"
                  value={formData.province}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  disabled={!isEditing}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Postal Code"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  disabled={!isEditing}
                />
              </Grid>
            </Grid>

            <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
              {isEditing ? (
                <>
                  <Button variant="contained" color="primary" onClick={handleSave}>
                    Save
                  </Button>
                  <Button variant="outlined" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                </>
              ) : (
                <Button variant="contained" color="primary" onClick={() => setIsEditing(true)}>
                  Edit Profile
                </Button>
              )}
              <Button variant="contained" color="secondary" onClick={() => setOpenModal(true)}>
                Update Password
              </Button>
            </Box>

            {/* Reviews Section */}
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" gutterBottom>
                Reviews
              </Typography>
              {reviews.length === 0 ? (
                <Typography variant="body1">No reviews available.</Typography>
              ) : (
                reviews.map((review, index) => (
                  <Card key={index} sx={{ mb: 2 }}>
                    <CardContent>
                      <Typography variant="subtitle1">
                        {review.reviewerName}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Rating: {review.rating} / 5
                      </Typography>
                      <Typography variant="body2">
                        {review.description}
                      </Typography>
                    </CardContent>
                  </Card>
                ))
              )}
            </Box>
          </Box>

          {/* Password Update Modal */}
          <Modal open={openModal} onClose={() => setOpenModal(false)}>
            <Box
              sx={{
                p: 3,
                bgcolor: "white",
                borderRadius: 2,
                width: "300px",
                margin: "auto",
                marginTop: "20vh"
              }}
            >
              <Typography variant="h6">Change Password</Typography>
              <TextField
                label="Current Password"
                name="currentPassword"
                type="password"
                fullWidth
                margin="normal"
                onChange={handlePasswordChange}
              />
              <TextField
                label="New Password"
                name="newPassword"
                type="password"
                fullWidth
                margin="normal"
                onChange={handlePasswordChange}
              />
              <TextField
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                fullWidth
                margin="normal"
                onChange={handlePasswordChange}
              />
              <Button variant="contained" color="primary" sx={{ mt: 2 }} fullWidth>
                Submit
              </Button>
            </Box>
          </Modal>
        </Paper>
      </Box>
    </Container>
  );
};

export default WorkerProfile;

