import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Box, Avatar, Button, TextField, Typography, IconButton
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useState, useEffect } from "react";


const CustomerUpdateModal = ({ open, handleClose, customer }) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [fullName, setFullName] = useState(["", ""])
  const [address, setAddress] = useState(["", ""])
  const [phone, setPhone] = useState("")
  useEffect(() => {
    if (customer) {
      setFullName([customer.first_name, customer.last_name]);
      setAddress([customer.address.line1, customer.address.postal_code]);
      setPhone(customer.phone);
    }
  }, [customer]);
  if (!customer) return null;

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };
  const handleDelete = async (customerId) => {
    try {
      const response = await fetch(`http://localhost:3000/users/${customerId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Failed to delete customer");
      }
      const result = await response.json();
      console.log(result.message);
      setDeleteDialogOpen(false);
      handleClose(); // Closing both modals
      // Optionally, notify the parent component that the customer has been deleted
    } catch (error) {
      console.error("Error deleting customer:", error);
    }
  };
  const handleSave = async () => {
    const userData = {
      _id: customer._id,
      // username: customer.username,
      // isVerified: customer.isVerified,
      first_name: fullName[0],
      last_name: fullName[1],
      // email: customer.email,
      // phone: customer.phone,
      // role: "consumer",
      // createdAt: customer.createdAt,
      // updatedAt: customer.updatedAt,
      // __v: customer.__v,
      address: {
        // ...customer.address,
        line1: address[0], // Update address line1 from state
        // unit_no: "", // You can handle this with state if necessary
        postal_code: address[1], // Update postal code from state
      }
    }
    try {
      const response = await fetch(`http://localhost:3000/user/${customer._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error("Failed to update user details");
      }

      const result = await response.json();
      console.log("User details updated successfully:", result);
      handleClose();
    } catch (error) {
      console.error("Error updating user details:", error);
    }
  };
  const handleFullNameChange = (e) => {
    const nameParts = e.target.value.split(" ");
    setFullName([nameParts[0], nameParts[1]]);
  };
  const handleAddressChange = (e) => {
    const fullAddress = e.target.value;
    const addressParts = fullAddress.split(" ");
    setAddress([addressParts[0], addressParts[1]]);
  };
  return (
    <>
      {/* Customer Edit Modal */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          Edit Customer
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{ position: "absolute", right: 10, top: 10 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>

            {/* Avatar Upload */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Avatar sx={{ width: 80, height: 80 }} />
              <Box>
                <Button variant="contained" component="label">Upload Photo</Button>
                <Button variant="text">Remove Photo</Button>
              </Box>
            </Box>

            {/* Full Name & Email */}
            <TextField label="Full Name" fullWidth value={fullName.join(" ")} onChange={handleFullNameChange} />
            <TextField label="Email" fullWidth value={customer.email} disabled />

            {/* Phone & Address */}
            <TextField label="Phone" fullWidth value={phone} onChange={(e) => setPhone(e.target.value)} />
            <TextField label="Address" fullWidth value={address.join(" ")} onChange={handleAddressChange} />

            {/* Delete Account Section */}
            <Typography color="error">
              Deleting this account will remove all customer data. This action cannot be undone.
            </Typography>
            <Button variant="outlined" color="error" onClick={handleDeleteClick}>
              Delete Account
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
          <Button variant="contained" color="primary" onClick={handleSave}> Save Changes</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Account Deletion</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this customer? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => handleDelete(customer._id)}
          >
            Yes, Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CustomerUpdateModal;
