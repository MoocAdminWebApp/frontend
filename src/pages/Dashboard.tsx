import * as React from "react";
import { Box, Typography } from "@mui/material";

const Dashboard: React.FC = () => {
  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Dashboard
      </Typography>
      <Typography>
        Welcome to the admin dashboard. This is where you can manage your application.
      </Typography>
    </Box>
  );
};

export default Dashboard;
