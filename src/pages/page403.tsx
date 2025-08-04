import React from "react";
import { Box, Typography, Button, Container } from "@mui/material";
import { Home as HomeIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <Container maxWidth="sm">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
        textAlign="center"
      >
        <Typography variant="h1" color="primary" gutterBottom>
          403
        </Typography>
        <Typography variant="h4" gutterBottom>
          Oops! You don't have the permission to view this page.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<HomeIcon />}
          onClick={handleGoHome}
        >
          Go to Home
        </Button>
      </Box>
    </Container>
  );
};

export default NotFound;
