// thunks/fetchUserPermissions.ts
import { get } from "../request/axios";
import { setPermissions } from "../store/authSlice";
import { AppThunk } from "../store/store";
import { PermissionDto } from "../types/permission";

export const fetchUserPermissions =
  (roleId: number): AppThunk =>
  async (dispatch) => {
    try {
      const resp = await get<PermissionDto[]>(`/permission/role/${roleId}`);
      if (resp.isSuccess) {
        // convert PermissionDto[] into string[]
        const permissionList = resp.data.map((p) => p.permissionName);
        dispatch(setPermissions(permissionList));
      }
    } catch (err) {
      console.error(`Failed to fetch role ${roleId} permission`, err);
    }
  };
