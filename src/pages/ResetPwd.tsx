import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Formik, Form, FormikHelpers } from "formik";
import {
  Box,
  Typography,
  Alert,
  IconButton,
  InputAdornment,
  TextField,
  Button,
  CircularProgress
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import * as Yup from "yup";
import {post } from "../request/axios/index";
import { useSearchParams } from "react-router-dom";
//Define the type of form value
import { useTheme } from '@mui/material/styles';
interface ResetPwdFormValues {
  password: string;
  confirmPassword: string;
}

//Define Yup validation rules
const SignupSchema = Yup.object().shape({
  password: Yup.string()
    .required("Password is required")
    .min(5, "Password must be at least 6 characters"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), ''], 'Passwords must match')
    .required('Please confirm your password'),
});

const ResetPwd: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const theme = useTheme();

  const handleSignup = async (
    values: ResetPwdFormValues,
    { setSubmitting }: FormikHelpers<ResetPwdFormValues>
  ) => {
    setIsLoading(true);
    setError("");
    try {
      let resp = await post<string>("/auth/resetPwd", {
        token,
        password: values.password,
      });
      if (resp.isSuccess) {
        navigate("/resetPwdSuccess");
      } else {
       setError(resp.message || "The user already exists");
      }
    } catch (err) {
      setError("Reset failed. Token may be expired or invalid");
    
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
        background:`linear-gradient(45deg, #1976d2  0%, ${theme.palette.secondary.main}  50%, ${theme.palette.primary.main} 100%)`
      }}
    >
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        sx={{ fontWeight: "bold", mb: 4 }}
      >
        Reset Your Password
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
          initialValues={{password: "", confirmPassword: ""}}
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
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={isSubmitting || isLoading}
                  sx={{ mt: 2, height: 48 }}
                 >
                {isLoading ? <CircularProgress size={24} /> : "Submit"}
                </Button>
            </Form>
          )}
        </Formik>
      </Box>
    </Box>
  );
};

export default ResetPwd;
