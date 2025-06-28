import * as React from 'react';
import { lazy, Suspense, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Box, CircularProgress, CssBaseline } from '@mui/material';
import { Toaster } from "react-hot-toast";
import CustomAppBar from './components/mainLayout/AppBar';
import Layout from './components/mainLayout/Layout';
import Login from './pages/Login';
import Page404 from './pages/page404';
import { Provider } from 'react-redux';
import store from './store/store';
import ProtectedRoute from './components/ProtectedRoute';



import { useSelector } from 'react-redux';
import { RootState } from './store/store';
import { useDispatch } from 'react-redux';
//import menuItems, { MenuItem } from './menuItems';
import ProfileForm from './pages/ProfileForm';
import componentMaps from './componentMaps'
import { MenuDto, UserPermissionDto } from './types/menu';
import { get } from './request/axios';
import { setPermissions } from './store/PermissionSlice';
import { MenuType } from './types/enum';

const Dashboard = lazy(() => import("./pages/Dashboard"));
//Recursive generation of routing
const renderRoutes = (items: MenuDto[]) => {
  return items.filter(x => x.route !== "/").map((item) => {
    const Component = item.componentPath === undefined ? null : componentMaps[item.componentPath];
    return (
      <React.Fragment key={item.id}>
        <Route
          path={item.route}
          element={
            // <Suspense fallback={<CircularProgress />}>
            //   {Component ? <Component /> : null} {/* If the component exists, render; otherwise, return null */}
            // </Suspense>
            <Suspense >
              {Component ? <Component /> : null} {/* If the component exists, render; otherwise, return null */}
            </Suspense>
          }
        />
        {item.children && renderRoutes(item.children)} {/* Recursive rendering sub route */}
      </React.Fragment>
    );
  });
};

const App: React.FC = () => {
  const [open, setOpen] = useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };


  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuth);
  const { menuItems } = useSelector((state: RootState) => state.permission);
  const dispatch = useDispatch();

  // useEffect(() => {

  //   const getPermissions = async () => {
  //     let getResp = await get<UserPermissionDto>(
  //       "/Users/GetCurrentUserPermissList"
  //     );
  //     if (getResp.isSuccess) {
  //       getResp.data.menus.push({
  //         id: 0,
  //         title: "Dashboard",
  //         orderNum: -1, level: 0,
  //         route: "/",
  //         componentPath: "./pages/Dashboard.jsx",
  //         menuType: MenuType.Menu,
  //         children: [] as Array<MenuDto>,
  //         permission: '',
  //         mark: ''
  //       });

  //       getResp.data.menus = getResp.data.menus.sort(x => x.orderNum)
  //       dispatch(setPermissions({
  //         menuItems: getResp.data.menus,
  //         permissions: []
  //       }));
  //     }
  //   }
  //   if (isAuthenticated) {
  //     getPermissions();
  //   }

  // }, [dispatch, isAuthenticated])


  // useEffect(() => {
  //   // console.log('menuItems', menuItems);
  // }, [menuItems])

  return (
    <Provider store={store}>

      <Toaster />
      <Router>
        <Box sx={{ display: 'flex' }}>
          <CssBaseline />
          <Routes>
            {/* Login page not required Layout */}
            <Route path="/login" element={<Login />} />
            {/* Other pages require Layout */}
            <Route
              element={
                <>
                  <CustomAppBar open={open} handleDrawerOpen={handleDrawerOpen} />
                  <Layout open={open} handleDrawerClose={handleDrawerClose}>
                    <ProtectedRoute />
                  </Layout>
                </>
              }
            >
              <Route path="/" element={<Dashboard />} />
              <Route path="/profile" element={<ProfileForm />} />
              {menuItems && renderRoutes(menuItems)}
            </Route>
            <Route path="*" element={<Page404 />} />
          </Routes>
        </Box>
      </Router>

    </Provider>
  );
};

export default App;