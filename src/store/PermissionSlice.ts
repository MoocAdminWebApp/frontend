import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MenuDto } from "../types/menu";

interface PermissionState {
  menuItems: Array<MenuDto> | null;
  permissions: Array<string> | null;
}

const getInitialState = (): PermissionState => {
  const permissions = localStorage.getItem("user_permissions");
  const menuDtos = localStorage.getItem("user_menuItems");
  if (permissions != null && menuDtos != null) {
    return {
      permissions: JSON.parse(permissions),
      menuItems: JSON.parse(menuDtos),
    };
  }

  return {
    menuItems: null,
    permissions: null,
  };
};

const permissionSlice = createSlice({
  name: "permission",
  initialState: getInitialState(),
  reducers: {
    setPermissions(
      state,
      action: PayloadAction<{
        menuItems: Array<MenuDto>;
        permissions: Array<string>;
      }>
    ) {
      state.menuItems = action.payload.menuItems;
      state.permissions = action.payload.permissions;
      localStorage.setItem(
        "user_menuItems",
        JSON.stringify(action.payload.menuItems)
      );
      localStorage.setItem(
        "user_permissions",
        JSON.stringify(action.payload.permissions)
      );
    },
    clearPermissions(state) {
      state.menuItems = null;
      state.permissions = null;
      localStorage.removeItem("user_menuItems");
      localStorage.removeItem("user_permissions");
    },
  },
});

export const { setPermissions, clearPermissions } = permissionSlice.actions;
export default permissionSlice.reducer;
