import React from "react";
import { CircularProgress, Box, Backdrop } from "@mui/material";

interface PageLoadingProps {
  loading: boolean; // Control whether to display loading animation
  size?: number; // Size of loading animation
  color?: string; // Load animation colors
  message?: string; // Prompt information during loading
}

const AppLoading: React.FC<PageLoadingProps> = ({
  loading,
  size = 40,
  color = "primary",
  message,
}) => {
  if (!loading) return null; // If the loading animation is not displayed, return directly null

  return (
    <Backdrop
      sx={{ color: "#fff", zIndex: theme => theme.zIndex.drawer + 1, position: "absolute" }}
      open={loading} // Control Display
    >
      <CircularProgress size={size} color={color as "primary" | "secondary" | "inherit"} />
      {message && <Box sx={{ mt: 2, color: "text.secondary" }}>{message}</Box>}
    </Backdrop>
  );
};

export default AppLoading;
