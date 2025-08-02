import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Formik, Form,FormikHelpers } from "formik";
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Alert,
  TextField,
} from "@mui/material";
import { useTheme } from '@mui/material/styles';
import * as Yup from "yup";
import {post } from "../request/axios/index";

//Define the type of form value
interface ResetEmailFormValues {
  email: string;
}

//Define Yup validation rules
const SignupSchema = Yup.object().shape({
  email: Yup.string()
    .required("email is required")
    .min(3, "email must be at least 3 characters"),
});

const ForgotPwd: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const theme = useTheme();
  const handleSignup = async (
    values: ResetEmailFormValues,
    { setSubmitting }: FormikHelpers<ResetEmailFormValues>
  ) => {
    setIsLoading(true);
    setError("");
    try {
      let resp = await post<string>("/auth/forgotPwd", {
        email: values.email,
      });
      if (resp.isSuccess) {
        navigate("/SendResetEmailSuccess");
      } else {
       setError(resp.message || "The user does not exist");
  
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    
    } finally {
      setIsLoading(false);
      setSubmitting(false);
    }
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
        Forgot Your Password ?
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
          initialValues={{ email: ""}}
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
                label="enter your previous registered email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.email && Boolean(errors.email)}
                helperText={touched.email && errors.email}
                fullWidth
                sx={{ mb: 2 }}
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

export default ForgotPwd;
