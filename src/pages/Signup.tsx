import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Formik, Form,FormikHelpers } from "formik";
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Alert,
  IconButton,
  InputAdornment,
  TextField,
  MenuItem,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import * as Yup from "yup";
import {post } from "../request/axios/index";
//Define the type of form value
interface SignupFormValues {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  access: string;
}

//Define Yup validation rules
const SignupSchema = Yup.object().shape({
  email: Yup.string()
    .required("email is required")
    .min(3, "email must be at least 3 characters"),
  password: Yup.string()
    .required("Password is required")
    .min(5, "Password must be at least 6 characters"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), ''], 'Passwords must match')
    .required('Please confirm your password'),
  firstName: Yup.string()
    .required("firstName is required")
    .min(3, "firstName must be at least 3 characters"),
  lastName: Yup.string()
    .required("lastName is required")
    .min(3, "lastName must be at least 3 characters"),
  access: Yup.string()
    .required("access is required")
    .min(3, "access must be at least 3 characters"),
});

const Signup: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const accessOptions = [{ value: "STUDENT", label: "Student" },
  { value: "TEACHER", label: "Teacher" },
  { value: "ADMIN", label: "Admin" },];

  const handleSignup = async (
    values: SignupFormValues,
    { setSubmitting }: FormikHelpers<SignupFormValues>
  ) => {
    setIsLoading(true);
    setError("");
    try {
      let resp = await post<string>("/signup", {
        email: values.email,
        password: values.password,
        firstName: values.firstName,
        lastName: values.lastName,
        access: values.access
      });
      if (resp.isSuccess) {
        navigate("/signupSuccess");
      } else {
       setError(resp.message || "The user already exists");
  
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    
    } finally {
      setIsLoading(false);
      setSubmitting(false);
    }
  };
  const handleTogglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100vh",
        backgroundColor: "background.default",
        p: 3,
      }}
    >
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        sx={{ fontWeight: "bold", mb: 4 }}
      >
        Sign Up
      </Typography>
      <Box
        sx={{
          width: "100%",
          maxWidth: 400,
          p: 3,
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <Formik
          initialValues={{ email: "", password: "", confirmPassword: "", firstName: "", lastName: "", access:"" }}
          validationSchema={SignupSchema}
          onSubmit={handleSignup}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            isSubmitting,
          }) => (
            <Form>
              {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {error}
                </Alert>
              )}
              <TextField
                name="email"
                label="email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.email && Boolean(errors.email)}
                helperText={touched.email && errors.email}
                fullWidth
                sx={{ mb: 2 }}
              />
              <TextField
                name="password"
                label="Password"
                type={showPassword ? "text" : "password"}
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.password && Boolean(errors.password)}
                helperText={touched.password && errors.password}
                fullWidth
                sx={{ mb: 2 }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleTogglePasswordVisibility}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
               <TextField
                name="confirmPassword"
                label="confirmPassword"
                type={showPassword ? "text" : "password"}
                value={values.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.confirmPassword && Boolean(errors.confirmPassword)}
                helperText={touched.confirmPassword && errors.confirmPassword}
                fullWidth
                sx={{ mb: 2 }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleTogglePasswordVisibility}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                name="firstName"
                label="firstName"
                value={values.firstName}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.firstName && Boolean(errors.firstName)}
                helperText={touched.firstName && errors.firstName}
                fullWidth
                sx={{ mb: 2 }}
              />
              <TextField
                name="lastName"
                label="lastName"
                value={values.lastName}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.lastName && Boolean(errors.lastName)}
                helperText={touched.lastName && errors.lastName}
                fullWidth
                sx={{ mb: 2 }}
              />
              <TextField
                select
                name="access"
                label="access"
                value={values.access}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.access && Boolean(errors.access)}
                helperText={touched.access && errors.access}
                fullWidth
                sx={{ mb: 2 }}
              >
              {accessOptions.map((option) => (
                 <MenuItem key={option.value} value={option.value}>
                {option.label}
                </MenuItem>
                ))}
              </TextField>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={isSubmitting || isLoading}
                sx={{ mt: 2, height: 48 }}
              >
              {isLoading ? <CircularProgress size={24} /> : "Sign Up"}
              </Button>
            </Form>
          )}
        </Formik>
      </Box>
     
    </Box>
  );
};

export default Signup;
