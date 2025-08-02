import React, { useEffect, useState } from "react";
import { Category } from "../../../types/category";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Stack,
  Switch,
  TextField,
} from "@mui/material";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { put } from "../../../request/axios";
import { Formik } from "formik";
import { updateCategoryById } from "../../../request/category";

interface CategoryEditDialogProps {
  open: boolean;
  category: Category | null;
  onClose: () => void;
  onSaveSuccess: () => void;
}

const validationSchema = Yup.object({
  name: Yup.string().required("Name is required").max(100),
  description: Yup.string(),
  icon: Yup.string().max(255, "Icon URL is too long"),
  isPublic: Yup.boolean(),
});

const CategoryEditDialog: React.FC<CategoryEditDialogProps> = ({ open, category, onClose, onSaveSuccess }) => {
  if (!category) return null;

  const initialValues = {
    name: category.name,
    description: category.description || "",
    icon: category.icon || "",
    isPublic: category.isPublic,
  };
  const handleSubmit = async (values: typeof initialValues, { setSubmitting }: any) => {
    try {
      await updateCategoryById(category.id, {
        ...values,
        isPublic: values.isPublic ?? false,
      });
      toast.success("Updated successfully");
      onSaveSuccess();
      onClose();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Update failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (!category) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Edit Category</DialogTitle>
      <DialogContent dividers>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ values, handleChange, handleBlur, handleSubmit, errors, touched, setFieldValue, isSubmitting }) => {
            return (
              <form onSubmit={handleSubmit} noValidate>
                <Stack spacing={2} mt={1}>
                  <TextField
                    label="Name"
                    name="name"
                    value={values.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.name && Boolean(errors.name)}
                    helperText={touched.name && errors.name}
                    fullWidth
                    autoFocus
                    InputLabelProps={{ shrink: true }}
                  />
                  <TextField
                    label="Description"
                    name="description"
                    value={values.description}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.description && Boolean(errors.description)}
                    helperText={touched.description && errors.description}
                    fullWidth
                    autoFocus
                    InputLabelProps={{ shrink: true }}
                  />
                  <TextField
                    label="Icon URL"
                    name="icon"
                    value={values.icon}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.icon && Boolean(errors.icon)}
                    helperText={touched.icon && errors.icon}
                    fullWidth
                    autoFocus
                    InputLabelProps={{ shrink: true }}
                  />
                  <FormControlLabel
                    control={
                      <Switch checked={values.isPublic} onChange={() => setFieldValue("isPublic", !values.isPublic)} />
                    }
                    label="Public"
                  />
                </Stack>
                <DialogActions>
                  <Button type="submit" variant="contained">
                    Save
                  </Button>
                  <Button onClick={onClose}>Cancel</Button>
                </DialogActions>
              </form>
            );
          }}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

export default CategoryEditDialog;
