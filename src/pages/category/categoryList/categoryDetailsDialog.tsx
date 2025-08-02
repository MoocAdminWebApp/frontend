import React from "react";
import { useState, useEffect } from "react";
import {
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Grid,
} from "@mui/material";
import { fetchCategoryById } from "../../../request/category";
import { Category } from "../../../types/category";

interface CategoryDetailDialogProps {
  open: boolean;
  categoryId: number | null;
  isAdmin: boolean;
  onClose: () => void;
}

const CategoryDetailDialog: React.FC<CategoryDetailDialogProps> = ({ open, categoryId, isAdmin, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<Category | null>(null);

  useEffect(() => {
    if (!open || categoryId == null) return;

    setLoading(true);
    setError(null);

    fetchCategoryById(categoryId)
      .then((category) => {
        setData(category);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, [open, categoryId]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Category Details</DialogTitle>
      <DialogContent dividers>
        {loading && <CircularProgress />}
        {error && <Typography color="error">{error}</Typography>}
        {data && (
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <strong>ID</strong>
            </Grid>
            <Grid item xs={6}>
              {data.id}
            </Grid>

            <Grid item xs={6}>
              <strong>名称</strong>
            </Grid>
            <Grid item xs={6}>
              {data.name}
            </Grid>

            <Grid item xs={6}>
              <strong>Description</strong>
            </Grid>
            <Grid item xs={6}>
              {data.description}
            </Grid>

            <Grid item xs={6}>
              <strong>Parent Category</strong>
            </Grid>
            <Grid item xs={6}>
              {data.parentId === null ? "None" : data.parentName}
            </Grid>

            {isAdmin && (
              <>
                <Grid item xs={6}>
                  <strong>Visibility</strong>
                </Grid>
                <Grid item xs={6}>
                  {data.isPublic ? "Public" : "Hidden"}
                </Grid>

                <Grid item xs={6}>
                  <strong>Status</strong>
                </Grid>
                <Grid item xs={6}>
                  {data.isDeleted ? "Deleted" : "Active"}
                </Grid>
              </>
            )}

            <Grid item xs={6}>
              <strong>Created At</strong>
            </Grid>
            <Grid item xs={6}>
              {new Date(data.createdAt as string).toLocaleString()}
            </Grid>

            <Grid item xs={6}>
              <strong>Created By</strong>
            </Grid>
            <Grid item xs={6}>
              {data.creator}
            </Grid>

            <Grid item xs={6}>
              <strong>Updated At</strong>
            </Grid>
            <Grid item xs={6}>
              {new Date(data.updatedAt as string).toLocaleString()}
            </Grid>

            <Grid item xs={6}>
              <strong>Updated By</strong>
            </Grid>
            <Grid item xs={6}>
              {data.updater}
            </Grid>

            {isAdmin && (
              <>
                <Grid item xs={6}>
                  <strong>Deleted At</strong>
                </Grid>
                <Grid item xs={6}>
                  {data.deletedAt ? new Date(data.deletedAt as string).toLocaleString() : ""}
                </Grid>
              </>
            )}
          </Grid>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default CategoryDetailDialog;
