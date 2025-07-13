import { useState } from "react";
import { Box, Toolbar } from "@mui/material";
import Sidebar from "../components/Sidebar/Sidebar";
import { Outlet } from "react-router-dom";

const drawerWidth = 240; // Sidebar width

const AdminLayout = () => {
  const [open, setOpen] = useState(false);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", backgroundColor: "#f8f9fa" }}>
      {/* Sidebar */}
      <Sidebar open={open} toggleDrawer={toggleDrawer} />

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 6,
          transition: "margin 0.3s ease-in-out",
          marginLeft: open ? `${drawerWidth}px` : "60px", // Shift content when sidebar opens
          width: `calc(100% - ${open ? drawerWidth : 60}px)`, // Adjust content width dynamically
        }}
      >
        {/* <Toolbar /> */}
        <Outlet />
      </Box>
    </Box>
  );
};

export default AdminLayout;
