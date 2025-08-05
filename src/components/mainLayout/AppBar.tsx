import * as React from "react";
import { useState, useEffect } from "react";
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
import { Box, Avatar } from "@mui/material";

import { logout } from "../../store/authSlice";
import { clearPermissions } from "../../store/PermissionSlice";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import {
  ensureTrailingSlash,
  isBase64DataURL,
  imageHttpUrlToBase64,
} from "../../utils/stringUtil";
import { get } from "../../request/axios";
import { ProfileDto } from "../../types/profile";
import { getFullAvatarUrl } from "../../utils/getFullAvatarUrl";

const drawerWidth = 300;

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
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
//get full avatar URL
const CustomAppBar: React.FC<CustomAppBarProps> = ({
  open,
  handleDrawerOpen,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [avatar, setAvatar] = useState<string>("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loginUser = useSelector((state: RootState) => state.auth.user);

  // fetch user avatar when component mounts or loginUser changes
  useEffect(() => {
    const fetchUserAvatar = async () => {
      if (loginUser?.userId) {
        try {
          const resp = await get<ProfileDto>(
            `/profiles/by-user/${loginUser.userId}`
          );
          if (resp.isSuccess && resp.data && resp.data.avatar) {
            const fullAvatarUrl = getFullAvatarUrl(resp.data.avatar);
            setAvatar(fullAvatarUrl);
          } else {
            setAvatar(""); // clear avatar if not found and show default avatar
          }
        } catch (error) {
          console.error("Failed to fetch user avatar:", error);
          setAvatar(""); // clear avatar on error
        }
      } else {
        setAvatar(""); // If no user is logged in, clear the avatar
      }
    };

    fetchUserAvatar();
  }, [loginUser?.userId, loginUser?.avatar]);

  // When the user update avatar in ProfileForm page, listen to the change from redux store
  useEffect(() => {
    if (loginUser?.avatar) {
      const fullAvatarUrl = getFullAvatarUrl(loginUser.avatar);
      setAvatar(fullAvatarUrl);
    }
  }, [loginUser?.avatar]);

  // open the user menu
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  // close the user menu
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // handle menu item click
  const handleMenuItemClick = (action: string) => {
    handleMenuClose();
    switch (action) {
      case "profile":
        navigate("/profile");
        break;
      case "logout":
        dispatch(logout());
        //dispatch(clearPermissions());
        break;
      default:
        break;
    }
  };

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
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography variant="body2" sx={{ color: "inherit" }}>
            {`${loginUser?.firstName || ""} ${
              loginUser?.lastName || ""
            }`.trim()}
          </Typography>
          <IconButton
            color="inherit"
            aria-label="account of current user"
            aria-controls="user-menu"
            aria-haspopup="true"
            onClick={handleMenuOpen}
            sx={{ p: 0.5 }}
          >
            {avatar ? (
              <Avatar
                src={avatar}
                alt="User Avatar"
                sx={{
                  width: 32,
                  height: 32,
                  border: "2px solid rgba(255, 255, 255, 0.3)",
                }}
                onError={() => {
                  setAvatar(""); // if avatar fails to load, reset to default
                }}
              />
            ) : (
              <AccountCircle sx={{ fontSize: 32 }} />
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
            <MenuItem onClick={() => handleMenuItemClick("profile")}>
              Profile
            </MenuItem>
            <MenuItem onClick={() => handleMenuItemClick("logout")}>
              Logout
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default CustomAppBar;
