import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
} from "@mui/material";
import ServiceProviderUpdateModal from "../components/serviceProviderModal/ServiceProviderUpdateModal";
import { getAllServiceProviders } from "../api/serviceProviderApi";
const ManageWorkers = () => {
  const [open, setOpen] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState();
  const [workers, setWorker] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);



  async function fetchData() {
    const response = await getAllServiceProviders();
    setWorker(response.data.data)
  }

  const handleOpen = (worker) => {
    setSelectedWorker(worker);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedWorker();
    fetchData();
  };

  // New function to handle verification
  const handleVerify = async (workerId) => {
    const id = workerId.toString();
    try {
      const response = await fetch(`http://localhost:3000/serviceProviders/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "verified" }),
      });
      if (response.ok) {
        // Optionally update the local state or refetch data to reflect the change
        fetchData();
      } else {
        console.error("Error verifying worker:", response.statusText);
      }
    } catch (error) {
      console.error("Error verifying worker:", error);
    }
  };

  return (
    <Box sx={{ width: "100%", marginLeft: 15, marginTop: 5, p: 3 }}>
      <Typography variant="h4" fontWeight="bold">
        Manage Workers
      </Typography>
      <TextField fullWidth label="Search workers..." sx={{ my: 2 }} />

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Service</TableCell>
              <TableCell>Rating</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {workers.map((worker, index) => (
              <TableRow key={index}>
                <TableCell style={{ textTransform: "capitalize" }}>
                  {worker.userDetails.first_name} {worker.userDetails.last_name}
                </TableCell>
                <TableCell>{worker.userDetails.email}</TableCell>
                <TableCell>{worker.services.join(", ")}</TableCell>
                <TableCell>{worker.ratings}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    color="primary"
                    sx={{ mr: 1 }}
                    onClick={() => handleOpen(worker)}
                  >
                    View
                  </Button>
                  {worker.status === "verified" ? (
                    <Button variant="contained" color="success" disabled>
                      Verified
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      color="success"
                      onClick={() => handleVerify(worker._id)}
                    >
                      Verify
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Worker Profile Modal */}
      <ServiceProviderUpdateModal
        open={open}
        handleClose={handleClose}
        worker={selectedWorker}
      />
    </Box>
  );
};

export default ManageWorkers;

