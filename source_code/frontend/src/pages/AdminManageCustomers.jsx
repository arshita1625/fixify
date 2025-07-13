import { useEffect, useState } from "react";
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Button, TextField
} from "@mui/material";
import CustomerUpdateModal from "../components/UserModal/CustomerUpdateModal";
import { fetchAllUsers } from "../api/userApi";
const ManageCustomers = () => {
  const [open, setOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [customers, setCustomers] = useState([]);
  useEffect(() => {
    handleFetchUsers()
  }, []);


  // Function to open modal with selected customer
  const handleOpen = (customer) => {
    setSelectedCustomer(customer);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedCustomer(null);
    handleFetchUsers();
  };
  const handleFetchUsers = async () => {
    try {
      const userData = await fetchAllUsers();

      const consumers = userData.filter(user => user.role === "consumer").map(user => ({
        ...user,
        name: `${capitalize(user.first_name)} ${capitalize(user.last_name)}`
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
