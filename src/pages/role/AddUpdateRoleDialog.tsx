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
import { CreateRoleDto, UpdateRoleDto } from "../../types/role";

interface AddUpdateRoleDialogProps {
  open: boolean;
  onClose: () => void;
  role: UpdateRoleDto | null;
  onSave: (data: CreateRoleDto | UpdateRoleDto | null) => void;
}

const AddUpdateRoleDialog: React.FC<AddUpdateRoleDialogProps> = ({
  open,
  onClose,
  role,
  onSave,
}) => {
  // 初始化表单值，新增时为空，编辑时带入已有数据
  const initialValues = {
    id: role?.id ?? 0,
    roleName: role?.roleName ?? "",
    description: role?.description ?? "",
    status: role?.status ?? false,
  };

  const validationSchema = Yup.object({
    roleName: Yup.string().required("Role Name is required"),
    description: Yup.string(),
    status: Yup.boolean(),
  });

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{role ? "Edit Role" : "Add Role"}</DialogTitle>
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
                name="roleName"
                label="Role Name"
                fullWidth
                margin="normal"
                value={values.roleName}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.roleName && Boolean(errors.roleName)}
                helperText={touched.roleName && errors.roleName}
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
              <FormControlLabel
                control={
                  <Switch
                    name="status"
                    checked={values.status}
                    onChange={() => setFieldValue("status", !values.status)}
                    color="primary"
                  />
                }
                label={values.status ? "Active" : "Inactive"}
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

export default AddUpdateRoleDialog;
