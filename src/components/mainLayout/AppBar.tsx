import * as React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { styled } from "@mui/material/styles";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { Box } from "@mui/material";

import { logout } from "../../store/authSlice";
import { clearPermissions } from "../../store/PermissionSlice";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { ensureTrailingSlash, isBase64DataURL } from "../../utils/stringUtil";

const drawerWidth = 300;

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: prop => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

interface CustomAppBarProps {
  open: boolean;
  handleDrawerOpen: () => void;
}

const CustomAppBar: React.FC<CustomAppBarProps> = ({ open, handleDrawerOpen }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // 打开下拉菜单
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  // 关闭下拉菜单
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // if (isBase64DataURL(resp.data.avatar)) {
  //   setPreview(resp.data.avatar);
  // } else {
  //   let imageUrl = `${ensureTrailingSlash(process.env.REACT_APP_BASE_API_URL ?? '')}${resp.data.avatar}`;
  //   let imageData = await imageHttpUrlToBase64(imageUrl);
  //   setPreview(`data:image/png;base64,${imageData}`);
  // }

  // 处理菜单项点击
  const handleMenuItemClick = (action: string) => {
    handleMenuClose();
    switch (action) {
      case "profile":
        navigate("/profile");
        break;
      case "logout":
        console.log("Logout clicked");

        dispatch(logout());
        //dispatch(clearPermissions());
        break;
      default:
        break;
    }
  };
  const [avatar, setAvatar] = useState<string>("");
  const loginUser = useSelector((state: RootState) => state.auth.user);
  React.useEffect(() => {
    if (loginUser?.avatar) {
      if (isBase64DataURL(loginUser?.avatar)) {
        setAvatar(loginUser?.avatar);
      } else {
        let imageUrl = `${ensureTrailingSlash(process.env.REACT_APP_BASE_API_URL ?? "")}${loginUser?.avatar}`;
        setAvatar(imageUrl);
      }
    }
  }, [loginUser]);

  return (
    <AppBar position="fixed" open={open}>
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={handleDrawerOpen}
          edge="start"
          sx={{ mr: 2, ...(open && { display: "none" }) }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
          Mooc Dashboard
        </Typography>
        <Box>
          <IconButton
            color="inherit"
            aria-label="account of current user"
            aria-controls="user-menu"
            aria-haspopup="true"
            onClick={handleMenuOpen}
          >
            {loginUser?.userName}
            {avatar ? (
              <img
                src={avatar}
                alt="avatar"
                style={{ width: "30px", height: "30px", borderRadius: "50%" }}
              />
            ) : (
              <AccountCircle />
            )}
          </IconButton>
          <Menu
            id="user-menu"
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
          >
            <MenuItem onClick={() => handleMenuItemClick("profile")}>Profile</MenuItem>
            <MenuItem onClick={() => handleMenuItemClick("logout")}>Logout</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default CustomAppBar;
