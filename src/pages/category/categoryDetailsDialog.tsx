import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box, Avatar } from "@mui/material";
import { Category } from "../../types/category";

interface CategoryDetailDialogProps {
  open: boolean;
  onClose: () => void;
  category: Category | null;
}

const CategoryDetailDialog: React.FC<CategoryDetailDialogProps> = ({ open, onClose, category }) => {
  if (!category) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Category Details</DialogTitle>
      
      <DialogContent dividers>
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2">ID</Typography>
          <Typography>{category.id}</Typography>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2">Name</Typography>
          <Typography>{category.name}</Typography>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2">Description</Typography>
          <Typography>{category.description}</Typography>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2">Icon</Typography>
          {category.icon ? (
            <Avatar src={category.icon} sx={{ width: 40, height: 40 }} />
          ) : (
            <Typography>No icon</Typography>
          )}
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2">Public</Typography>
          <Typography>{category.isPublic ? "Yes" : "No"}</Typography>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2">Created At</Typography>
          <Typography>{category.createdAt ? new Date(category.createdAt).toLocaleString() : "--"}</Typography>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2">Updated At</Typography>
          <Typography>{category.updatedAt ? new Date(category.updatedAt).toLocaleString() : "--"}</Typography>
        </Box>

        
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="contained">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CategoryDetailDialog;