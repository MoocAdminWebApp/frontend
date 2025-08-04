import * as React from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../store/authSlice";
import { Formik, Form, FormikHelpers } from "formik";
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Alert,
  IconButton,
  InputAdornment,
  TextField,
  Grid,
  Link,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import * as Yup from "yup";
import { post } from "../request/axios/index";
import { jwtDecode } from "jwt-decode";
import { useTheme } from "@mui/material/styles";

// Imports for permission control and menu mapping
import { initSideMenu } from "../thunks/initSideMenu";
import { fetchRouteMapping } from "../thunks/fetchRouteMapping";
import { fetchUserPermissions } from "../thunks/fetchRolePermission";
import { AppDispatch } from "../store/store";

//Define the type of form value
interface LoginFormValues {
  email: string;
  password: string;
}

interface RoleInfo {
  createdAt: string;
  createdBy: number;
  description: string;
  id: number;
  roleName: string;
  status: true;
  updatedAt: string;
  updatedBy: number;
}

interface TokenPayload {
  userId: number;
  profileId: number;
  firstName: string;
  lastName: string;
  email: string;
  roles: RoleInfo[];
  address: string;
  gender: string;
  phone: string;
  birthdate: string;
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
  // const dispatch = useDispatch();
  const dispatch = useDispatch<AppDispatch>();
  const theme = useTheme();

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
      const decodedData = jwtDecode<TokenPayload>(resp.data);
      const userForFrontEnd = {
        userId: decodedData.userId,
        profileId: decodedData.profileId,
        lastName: decodedData.lastName,
        firstName: decodedData.firstName,
        email: decodedData.email,
        avatar: undefined,
        address: decodedData.address,
        gender: decodedData.gender,
        phone: decodedData.phone,
        birthdate: decodedData.birthdate,
      };
      if (resp.isSuccess) {
        dispatch(
          login({
            accessToken: resp.data,
            user: userForFrontEnd,
          })
        ); //Update Redux status

        // Init SideMenu, UserPermission, MenuRouteMapping
        dispatch(fetchUserPermissions(userForFrontEnd.userId));
        dispatch(fetchRouteMapping());
        dispatch(initSideMenu());

        navigate("/"); //After successful login, jump to the homepage
      } else {
        setError(resp.message || "Invalid username or password");
      }
    } catch (err) {
      setError("Invalid username or password. Please try again.");
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
        background: `linear-gradient(45deg, #1976d2  0%, ${theme.palette.secondary.main}  50%, ${theme.palette.primary.main} 100%)`,
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
        <Grid
          container
          justifyContent="space-between"
          sx={{ mt: 1, fontSize: "1rem" }}
        >
          <Grid item>
            <Link
              sx={{ textDecoration: "none" }}
              component={RouterLink}
              to="/forgotPwd"
            >
              <Typography
                sx={{
                  fontSize: "1rem",
                  color: "#000",
                  fontWeight: "bold",
                  mb: 2,
                  textAlign: "center",
                }}
                component="h1"
                variant="h5"
              >
                Forgot Password ?
              </Typography>
            </Link>
          </Grid>
          <Grid item>
            <Link
              sx={{ textDecoration: "none" }}
              component={RouterLink}
              to="/Signup"
            >
              <Typography
                sx={{
                  fontSize: "1rem",
                  color: "#000",
                  fontWeight: "bold",
                  mb: 2,
                  textAlign: "center",
                  textDecoration: "none",
                }}
                component="h1"
                variant="h5"
              >
                Sign Up
              </Typography>
            </Link>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Login;
