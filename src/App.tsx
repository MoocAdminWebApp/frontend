import * as React from "react";
import { lazy, Suspense, useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Box, CircularProgress, CssBaseline } from "@mui/material";
import { Toaster } from "react-hot-toast";
import CustomAppBar from "./components/mainLayout/AppBar";
import Layout from "./components/mainLayout/Layout";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Page404 from "./pages/page404";
import { Provider } from "react-redux";
import store from "./store/store";
import ProtectedRoute from "./components/ProtectedRoute";
import { useDispatch } from "react-redux";
//import menuItems, { MenuItem } from './menuItems';
import ProfileForm from "./pages/ProfileForm";
import User from "./pages/User";
import Demos from "./pages/demo";
import SignupSuccess from "./pages/SignupSuccess";

const Dashboard = lazy(() => import("./pages/Dashboard"));

const App: React.FC = () => {
  const [open, setOpen] = useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const dispatch = useDispatch();

  return (
    <Provider store={store}>
      <Toaster />
      <Router>
        <Box sx={{ display: "flex" }}>
          <CssBaseline />
          <Routes>
            {/* Login page not required Layout */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/signupSuccess" element={<SignupSuccess />} />
            {/* Other pages require Layout */}
            <Route
              element={
                <>
                  <CustomAppBar
                    open={open}
                    handleDrawerOpen={handleDrawerOpen}
                  />
                  <Layout open={open} handleDrawerClose={handleDrawerClose}>
                    <ProtectedRoute />
                  </Layout>
                </>
              }
            >
              <Route path="/" element={<Dashboard />} />
              <Route path="/profile" element={<ProfileForm />} />
              <Route path="/Demo" element={<Demos />} />
              <Route path="/User" element={<User />} />
            </Route>
            <Route path="*" element={<Page404 />} />
          </Routes>
        </Box>
      </Router>
    </Provider>
  );
};

export default App;
