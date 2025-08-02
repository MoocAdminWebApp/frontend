import React, { useEffect } from "react";
import {
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  MenuItem,
  Stack,
  Switch,
  TextField,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Category } from "../../types/category";

interface AddCategoryDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (formData: Partial<Category>) => void;
  parentOptions: Category[];
}

const validationSchema = Yup.object({
  name: Yup.string().required("Category name is required").max(100, "Category name cannot exceed 100 characters"),
  description: Yup.string().max(255, "Description too long"),
  icon: Yup.string().url("Must be a valid URL").nullable(),
  parentId: Yup.number().nullable(),
  isPublic: Yup.boolean(),
});

const AddCategoryDialog: React.FC<AddCategoryDialogProps> = ({ open, onClose, onSubmit, parentOptions }) => {
  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
      icon: "",
      parentId: "",
      isPublic: true,
    },
    validationSchema,
    onSubmit: (values) => {
      const parsedData = {
        ...values,
        parentId: values.parentId === "" ? null : Number(values.parentId),
      };
      onSubmit(parsedData);
    },
  });

  useEffect(() => {
    if (!open) {
      formik.resetForm();
    }
  }, [open]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <form onSubmit={formik.handleSubmit}>
        <DialogTitle>Add New Category</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField
              name="name"
              label="Name"
              fullWidth
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              name="description"
              label="Description"
              fullWidth
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.description && Boolean(formik.errors.description)}
              helperText={formik.touched.description && formik.errors.description}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              name="icon"
              label="Icon URL"
              fullWidth
              value={formik.values.icon}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.icon && Boolean(formik.errors.icon)}
              helperText={formik.touched.icon && formik.errors.icon}
              InputLabelProps={{ shrink: true }}
            />
            <Autocomplete
              options={parentOptions}
              getOptionLabel={(option) => option.name}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              value={parentOptions.find((c) => c.id === Number(formik.values.parentId)) || null}
              onChange={(_, newValue) => {
                formik.setFieldValue("parentId", newValue ? newValue.id : "");
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  name="parentId"
                  label="Parent Category"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
              )}
            />

            <FormControlLabel
              control={<Switch name="isPublic" checked={formik.values.isPublic} onChange={formik.handleChange} />}
              label="Public"
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button variant="contained" type="submit">
            Create
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddCategoryDialog;
