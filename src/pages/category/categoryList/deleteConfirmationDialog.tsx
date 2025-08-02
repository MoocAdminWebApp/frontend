import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material";
import React, { useState } from "react";
import { deleteCategoryById } from "../../../request/category";
import toast from "react-hot-toast";

interface DeleteConfirmationDialogProps {
  open: boolean;
  category: { id: number; name: string } | null;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteConfirmationDialog: React.FC<DeleteConfirmationDialogProps> = ({ open, category, onClose, onConfirm }) => {
  const [loading, setLoading] = useState(false);

  const handleDeleteConfirm = async () => {
    if (!category) return;
    setLoading(true);

    try {
      await deleteCategoryById(category.id);
      toast.success("Category deleted successfully");
      onConfirm();
      onClose();
    } catch (err: any) {
      const errorMessage = err?.message || "Delete failed. Please try again later.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Delete Confirmation</DialogTitle>
      <DialogContent>
        <Typography>
          Are you sure you want to delete category <strong>{category?.name}</strong>?
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button onClick={handleDeleteConfirm} color="error" variant="contained" disabled={loading}>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmationDialog;
