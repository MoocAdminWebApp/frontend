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
  FormControl,
  FormControlLabel,
  Switch,
  TextField,
  MenuItem,
} from "@mui/material";
import { Formik } from "formik";

//Uuserser pop-up component Prop
interface AddUpdateDialogProps {
  open: boolean;
  onClose: () => void;
  user: UpdateUserDto | null;
  onSave: (user: CreateUserDto | UpdateUserDto | null) => void;
}
const accessOptions = [
  { value: "ADMIN", label: "Admin" },
  { value: "TEACHER", label: "Teacher" },
  { value: "STUDENT", label: "Student" },
];
const AddUpdateDialog: React.FC<AddUpdateDialogProps> = ({
  open,
  onClose,
  user,
  onSave,
}) => {
  //const isEdit = user != null;
  const validationSchema = Yup.object({
    email: Yup.string().required("email is required"),
    //password: Yup.string().required("password is required"),
    firstName: Yup.string().required("firstName is required"),
    lastName: Yup.string().required("lastName is required"),
    access: Yup.mixed()
      .oneOf(["ADMIN", "TEACHER", "STUDENT"], "Invalid access type")
      .required("access is required"),
    active: Yup.boolean().required("access is required"),
  });

  const initialValues = {
    id: user ? user.id : 0,
    email: user ? user.email : "",
    //password: user ? user.password : "",
    firstName: user ? user.firstName : "",
    lastName: user ? user.lastName : "",
    access: user ? user.access : EAccessType.Teacher,
    active: user ? user.active : false,
    // createBy: user ? user.createBy : new Date(),
    // updateBy: user ? user.updateBy : new Date(),
  };

  const formikRef = useRef<any>(null); //  formikRef
  const handleSubmit = (values: UpdateUserDto | CreateUserDto) => {
    // create a new user（user为null）
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

  // function toLocalISOString(date: Date) {
  //   // 1. Obtain local time for each part
  //   const year = date.getFullYear();
  //   const month = String(date.getMonth() + 1).padStart(2, "0");
  //   const day = String(date.getDate()).padStart(2, "0");
  //   const hours = String(date.getHours()).padStart(2, "0");
  //   const minutes = String(date.getMinutes()).padStart(2, "0");
  //   // 2. Combine the format required for timestamp local
  //   return `${year}-${month}-${day}T${hours}:${minutes}`;
  // }

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
                label="email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                fullWidth
                margin="normal"
                variant="outlined"
                error={touched.email && Boolean(errors.email)}
                helperText={touched.email && errors.email}
              />

              <TextField
                name="firstName"
                label="firstName"
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
                label="lastName"
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
                label="access"
                value={values.access}
                onChange={handleChange}
                onBlur={handleBlur}
                select
                fullWidth
                margin="normal"
                variant="outlined"
              >
                {accessOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
              {/* <FormControl fullWidth margin="normal" variant="outlined">
                <TextField
                  name="dataTime"
                  label="Birthday"
                  type="datetime-local"
                  onBlur={handleBlur}
                  value={toLocalISOString(values.dataTime)}
                  onChange={(e) => {
                    const date = e.target.value
                      ? new Date(e.target.value)
                      : null;
                    setFieldValue("dataTime", date);
                  }}
                />
              </FormControl> */}

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
