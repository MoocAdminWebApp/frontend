// thunks/initSideMenu.ts
import { get } from "../request/axios";
import { buildSidebarStructure } from "../utils/treeStructureUtil";
import { setPermissions } from "../store/PermissionSlice";
import { AppThunk } from "../store/store";
import { MenuDto } from "../types/menu";

export const initSideMenu = (): AppThunk => async (dispatch) => {
  const resp = await get<MenuDto[]>("/menus");
  if (resp.isSuccess) {
    const structured = buildSidebarStructure(resp.data);
    dispatch(
      setPermissions({
        menuItems: structured,
        permissions: [],
      })
    );
  }
};
