import * as React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../store/authSlice";
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
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import * as Yup from "yup";

import {post } from "../request/axios/index";

//Define the type of form value
interface LoginFormValues {
  email: string;
  password: string;
}

//Define Yup validation rules
const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .required("email is required")
    .min(3, "email must be at least 3 characters"),
  password: Yup.string()
    .required("Password is required")
    .min(5, "Password must be at least 6 characters"),
});

const Login: React.FC = () => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async (
    values: LoginFormValues,
    { setSubmitting }: FormikHelpers<LoginFormValues>
  ) => {
    setIsLoading(true);
    setError("");

    try {
      let resp = await post<string>("/login", {
        email: values.email,
        password: values.password,
      });
      if (resp.isSuccess) {
        dispatch(
          login({
            accessToken: resp.data,
  
          })
        ); //Update Redux status

        navigate("/"); //After successful login, jump to the homepage
      } else {
        setError(resp.message || "Invalid username or password");
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
        Welcome Back
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
          initialValues={{ email: "alice@gmail.com", password: "password12" }}
          validationSchema={LoginSchema}
          onSubmit={handleLogin}
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
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={isSubmitting || isLoading}
                sx={{ mt: 2, height: 48 }}
              >
                {isLoading ? <CircularProgress size={24} /> : "Login"}
              </Button>
            </Form>
          )}
        </Formik>
      </Box>
    </Box>
  );
};

export default Login;
