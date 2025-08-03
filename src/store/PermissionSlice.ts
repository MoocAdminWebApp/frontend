// store/PermissionSlice.ts
import store from "./store";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MenuDto } from "../types/menu";
import { buildSidebarStructure } from "../utils/treeStructureUtil";
import { get } from "../request/axios";

export const initSidebarMenu = async () => {
  const resp = await get<MenuDto[]>("/menus");
  if (resp.isSuccess) {
    const structured = buildSidebarStructure(resp.data);
    store.dispatch(
      setPermissions({
        menuItems: structured,
        permissions: [],
      })
    );
  }
};

interface PermissionState {
  menuItems: Array<MenuDto> | null;
  permissions: Array<string> | null;
  routeMap: Record<string, number>;
}

const getInitialState = (): PermissionState => {
  return {
    permissions: null,
    menuItems: [],
    routeMap: {},
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
      state.routeMap = {}; // ✅ 同步清空 routeMap
      localStorage.removeItem("user_menuItems");
      localStorage.removeItem("user_permissions");
      localStorage.removeItem("user_routeMap"); // ✅ 清理缓存
    },
    setRouteMap(state, action: PayloadAction<Record<string, number>>) {
      state.routeMap = action.payload;
      localStorage.setItem("user_routeMap", JSON.stringify(action.payload));
    },
  },
});

export const { setPermissions, clearPermissions, setRouteMap } =
  permissionSlice.actions;
export default permissionSlice.reducer;
