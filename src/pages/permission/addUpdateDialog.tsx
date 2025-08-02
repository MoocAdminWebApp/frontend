import * as React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  FormControlLabel,
  Switch,
} from "@mui/material";
import { Formik } from "formik";
import * as Yup from "yup";
import { CreatePermissionDto, UpdatePermissionDto } from "../../types/permission";

interface AddUpdatePermissionDialogProps {
  open: boolean;
  onClose: () => void;
  data: UpdatePermissionDto | null;
  onSave: (data: CreatePermissionDto | UpdatePermissionDto | null) => void;
}

const AddUpdatePermissionDialog: React.FC<AddUpdatePermissionDialogProps> = ({
  open,
  onClose,
  data,
  onSave,
}) => {
  // 初始化表单值，新增时为空，编辑时带入已有数据
  const initialValues = {
    id: data?.id ?? 0,
    permissionName: data?.permissionName ?? "",
    description: data?.description ?? "",
  };

  // 校验规则，permissionName 必填，description 可选，
  const validationSchema = Yup.object({
    permissionName: Yup.string().required("Permission Name is required"),
    description: Yup.string(),
  });

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{data ? "Edit Permission" : "Add Permission"}</DialogTitle>
      <DialogContent>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={(values) => onSave(values)}
          enableReinitialize
        >
          {({
            values,
            handleChange,
            handleBlur,
            handleSubmit,
            errors,
            touched,
            setFieldValue,
          }) => (
            <form onSubmit={handleSubmit} noValidate>
              <TextField
                name="permissionName"
                label="Permission Name"
                fullWidth
                margin="normal"
                value={values.permissionName}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.permissionName && Boolean(errors.permissionName)}
                helperText={touched.permissionName && errors.permissionName}
                autoFocus
              />
              <TextField
                name="description"
                label="Description"
                fullWidth
                margin="normal"
                multiline
                rows={3}
                value={values.description}
                onChange={handleChange}
                onBlur={handleBlur}
              />
      
              <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button type="submit" variant="contained" color="primary">
                  Save
                </Button>
              </DialogActions>
            </form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

export default AddUpdatePermissionDialog;
