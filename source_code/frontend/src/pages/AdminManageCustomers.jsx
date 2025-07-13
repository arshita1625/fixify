import { useEffect, useState } from "react";
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Button, TextField
} from "@mui/material";
import CustomerUpdateModal from "../components/UserModal/CustomerUpdateModal";
import { fetchAllUsers } from "../api/userApi";
// const customers = [
//   { name: "Emma Wilson", email: "emma@example.com", bookings: 5 },
//   { name: "Liam Anderson", email: "liam@example.com", bookings: 3 },
//   { name: "Olivia Taylor", email: "olivia@example.com", bookings: 7 },
//   { name: "Noah Martinez", email: "noah@example.com", bookings: 2 },
//   { name: "Ava Johnson", email: "ava@example.com", bookings: 4 }
// ];

const ManageCustomers = () => {
  const [open, setOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [customers, setCustomers] = useState([]);
  useEffect(() => {
    handleFetchUsers()
  }, []);
  // const handleDeleteClick = () => {
  //   setDeleteDialogOpen(true);
  // };

  // const handleConfirmDelete = () => {
  //   // Perform account deletion (API Call or State Update)
  //   setDeleteDialogOpen(false);
  //   handleClose(); // Closing both modals
  // };


  // Function to open modal with selected customer
  const handleOpen = (customer) => {
    setSelectedCustomer(customer);
    setOpen(true);
  };


  // Function to close modal
  const handleClose = () => {
    setOpen(false);
    setSelectedCustomer(null);
    handleFetchUsers();
  };
  const handleFetchUsers = async () => {
    try {
      const userData = await fetchAllUsers();

      const consumers = userData.filter(user => user.role === "consumer").map(user => ({
        ...user, // Keep all existing user properties
        name: `${capitalize(user.first_name)} ${capitalize(user.last_name)}` // Concatenated name
      }));

      setCustomers(consumers);;
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };
  const capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };
  return (
    <Box sx={{ width: "80%", marginLeft: 15, marginTop: 5, p: 3 }}>
      <Typography variant="h4" fontWeight="bold">Manage Customers</Typography>
      <TextField fullWidth label="Search customers..." sx={{ my: 2 }} />

      <TableContainer component={Paper} sx={{ maxHeight: 400, overflowY: "auto" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Registered on</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {customers.map((customer, index) => (
              <TableRow key={index}>
                <TableCell>{customer.name}</TableCell>
                <TableCell>{customer.email}</TableCell>
                <TableCell>{new Date(customer.createdAt).toLocaleString()}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    color="primary"
                    sx={{ mr: 1 }}
                    onClick={() => handleOpen(customer)} // Open modal with selected customer
                  >
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Customer Update Modal */}
      <CustomerUpdateModal open={open} handleClose={handleClose} customer={selectedCustomer} />
    </Box>
  );
};

export default ManageCustomers;
