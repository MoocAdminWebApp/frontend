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
import ProfileForm from "./pages/ProfileForm";
import Demos from "./pages/demo";
import SignupSuccess from "./pages/SignupSuccess";
import ResetPwdSuccess from "./pages/ResetPwdSuccess";
import ResetPwd from "./pages/ResetPwd";
import ForgotPwd from "./pages/ForgotPwd";
import SendResetEmailSuccess from "./pages/SendResetEmailSuccess";
import User from "./pages/User";
import Role from "./pages/role";
import Menu from "./pages/menu";
import Course from "./pages/course/index";
import Chapter from "./pages/chapter";
import CourseOffering from "./pages/courseOffering";
import QuestionBank from "./pages/QuestionBank";
import CategoryPage from "./pages/category";
import CategoryList from "./pages/category/categoryList";
import Permission from "./pages/permission";
import Dummy from "./pages/dummy";

import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "./store/store";
import { useActiveMenuIdFromRoute } from "./hooks/useActiveMenuIdFromRoute";
import { initSideMenu } from "./thunks/initSideMenu";
import { fetchUserPermissions } from "./thunks/fetchRolePermission";
import { fetchRouteMapping } from "./thunks/fetchRouteMapping";

const Dashboard = lazy(() => import("./pages/Dashboard"));

const App: React.FC = () => {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    const user = store.getState().auth.user;

    if (user) {
      dispatch(fetchUserPermissions(user.userId));
      dispatch(fetchRouteMapping());
      dispatch(initSideMenu());
    }
  }, []);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const user = useSelector((state: RootState) => state.auth.user);
  return (
    <Provider store={store}>
      <Toaster />
      <Router>
        <Box sx={{ display: "flex" }}>
          <CssBaseline />
          <RouteDebugger />
          <Routes>
            {/* Login page not required Layout */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/signupSuccess" element={<SignupSuccess />} />
            <Route path="/resetPwd" element={<ResetPwd />} />
            <Route path="/resetPwdSuccess" element={<ResetPwdSuccess />} />
            <Route path="/forgotPwd" element={<ForgotPwd />} />
            <Route
              path="/sendResetEmailSuccess"
              element={<SendResetEmailSuccess />}
            />
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
              <Route path="/Role" element={<Role />} />
              <Route path="/Menu" element={<Menu />} />
              <Route path="/CourseOffering" element={<CourseOffering />} />
              <Route path="/Course" element={<Course />} />
              <Route path="/Chapter" element={<Chapter />} />
              <Route path="/QuestionBank" element={<QuestionBank />} />
              <Route path="/Dummy" element={<Dummy />} />
              <Route path="/Permission" element={<Permission />} />
              <Route path="/Category" element={<CategoryPage />}>
                <Route index element={<CategoryList />} />
                <Route path=":id/children" element={<CategoryList />} />
              </Route>
            </Route>
            <Route path="*" element={<Page404 />} />
          </Routes>
        </Box>
      </Router>
    </Provider>
  );
};

export default App;

const RouteDebugger = () => {
  const activeMenuId = useActiveMenuIdFromRoute();
  console.log("Active Menu ID:", activeMenuId);
  return null;
};
