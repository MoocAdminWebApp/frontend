import { useRef } from "react";
import { CreateUserDto, UpdateUserDto } from "../../types/user";
import { EAccessType } from "../../types/enum";
import * as Yup from "yup";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Switch,
  TextField,
  MenuItem,
  Autocomplete,
  Chip,
} from "@mui/material";
import { Formik } from "formik";
import { RoleDto } from "../../types/role";
//User pop-up component Prop
interface AddUpdateDialogProps {
  open: boolean;
  onClose: () => void;
  user: UpdateUserDto | null;
  onSave: (user: CreateUserDto | UpdateUserDto | null) => void;
  roles: RoleDto[];
}
const accessOptions = [
  { value: "ADMIN", label: "ADMIN" },
  { value: "TEACHER", label: "TEACHER" },
  { value: "STUDENT", label: "STUDENT" },
];
const AddUpdateDialog: React.FC<AddUpdateDialogProps> = ({
  open,
  onClose,
  user,
  onSave,
  roles,
}) => {
  const validationSchema = Yup.object({
    email: Yup.string().required("email is required"),
    firstName: Yup.string().required("firstName is required"),
    lastName: Yup.string().required("lastName is required"),
    access: Yup.mixed()
      .oneOf(["ADMIN", "TEACHER", "STUDENT"], "Invalid access type")
      .required("access is required"),
    active: Yup.boolean().required("access is required"),
    roleIds: Yup.array()
      .of(Yup.number())
      .min(1, "At least one role is required"),
  });

  const initialValues = {
    id: user ? user.id : 0,
    email: user ? user.email : "",
    firstName: user ? user.firstName : "",
    lastName: user ? user.lastName : "",
    access: user ? user.access : EAccessType.Admin,
    active: user ? user.active : false,
    roleIds: user ? user.roleIds || [] : [],
  };

  const formikRef = useRef<any>(null);
  const handleSubmit = (values: UpdateUserDto | CreateUserDto) => {
    // create a new user（user is null）
    if (!user) {
      const emailPrefix = values.email.split("@")[0];
      const password = `${values.firstName}${emailPrefix}`;
      // add password to values
      const newValues = { ...values, password };
      onSave && onSave(newValues);
    } else {
      // do not change password when updating an existed user
      onSave && onSave(values);
    }
  };

  const btnSave = () => {
    if (formikRef.current) {
      formikRef.current.submitForm(); //Manually trigger form submission
    }
  };

  //reason: DialogCloseReason
  const handleClose = (event: React.SyntheticEvent<{}>, reason: string) => {
    if (reason !== "backdropClick") {
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{user ? "Edit User" : "Add User"}</DialogTitle>
      <DialogContent>
        <Formik
          innerRef={formikRef}
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({
            values,
            handleChange,
            handleBlur,
            setFieldValue,
            errors,
            touched,
          }) => (
            <form>
              <TextField
                name="email"
                label="Email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                fullWidth
                margin="normal"
                variant="outlined"
                error={touched.email && Boolean(errors.email)}
                helperText={touched.email && errors.email}
                disabled={!!user}
              />
              <TextField
                name="firstName"
                label="FirstName"
                value={values.firstName}
                onChange={handleChange}
                onBlur={handleBlur}
                fullWidth
                margin="normal"
                variant="outlined"
                error={touched.firstName && Boolean(errors.firstName)}
                helperText={touched.firstName && errors.firstName}
              />
              <TextField
                name="lastName"
                label="LastName"
                value={values.lastName}
                onChange={handleChange}
                onBlur={handleBlur}
                fullWidth
                margin="normal"
                variant="outlined"
                error={touched.lastName && Boolean(errors.lastName)}
                helperText={touched.lastName && errors.lastName}
              />
              <TextField
                name="access"
                label="Access"
                value={values.access}
                onChange={handleChange}
                onBlur={handleBlur}
                select
                fullWidth
                margin="normal"
                variant="outlined"
                error={touched.access && Boolean(errors.access)}
                helperText={touched.access && errors.access}
              >
                {accessOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
              <Autocomplete
                multiple // multiple selection
                options={roles || []} // verify roles is not null
                getOptionLabel={(option) => option.roleName || ""} // avoid undefined
                isOptionEqualToValue={(option, value) => option.id === value.id} // compare logic
                value={roles.filter((role) => values.roleIds.includes(role.id))} // selected roles
                onChange={(event, newValue) => {
                  // update roleIds based on selected roles
                  setFieldValue(
                    "roleIds",
                    newValue.map((role) => role.id)
                  );
                }}
                renderTags={(selectedRoles, getTagProps) =>
                  selectedRoles.map((option, index) => (
                    <Chip
                      variant="outlined"
                      label={option.roleName}
                      {...getTagProps({ index })}
                      key={option.id}
                    />
                  ))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Roles"
                    margin="normal"
                    variant="outlined"
                    error={touched.roleIds && Boolean(errors.roleIds)}
                    helperText={touched.roleIds && errors.roleIds}
                    placeholder="Select roles..."
                  />
                )}
                renderOption={(props, option, { selected }) => (
                  <li {...props} key={option.id}>
                    <input
                      type="checkbox"
                      checked={selected}
                      style={{ marginRight: 8 }}
                      readOnly
                    />
                    {option.roleName}
                  </li>
                )}
                disableCloseOnSelect
                limitTags={5} // Limit the number of displayed tags
                sx={{
                  "& .MuiAutocomplete-tag": {
                    margin: "2px",
                  },
                }}
              />
              <FormControlLabel
                control={
                  <Switch
                    name="active"
                    checked={values.active}
                    onChange={handleChange}
                    color="primary"
                  />
                }
                label={values.active ? "active" : "not active"}
                labelPlacement="end"
              />
            </form>
          )}
        </Formik>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={btnSave} variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddUpdateDialog;
