
import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const SendResetEmailSuccess: React.FC = () => {
  const navigate = useNavigate();
  return (
    <Box
      sx={{
        minHeight: "100vh",
        width:"100vw",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
        p: 3,
      }}
    >
    <Box
    sx={{
      p: 4,
      bgcolor: "#f0fdf4",
      borderRadius: 2,
      boxShadow: 3,
      textAlign: "center",
      maxWidth: 400,
    }}
  >
      <Typography variant="h4" gutterBottom color="success">
        ✅ Send Reset Email Success!
      </Typography>
      <Typography variant="body1" sx={{ mb: 4 }}>
        Your reset password email has been sent successfully. Please check your email to reset your password.
      </Typography>
      <Button variant="contained" color="secondary" onClick={() => navigate("/login")}>
        Go to Login
      </Button>
    </Box>
    </Box>
  );
};

export default SendResetEmailSuccess;
