// thunks/fetchUserPermissions.ts
import { get } from "../request/axios";
import { setPermissions } from "../store/authSlice";
import { AppThunk } from "../store/store";
import { PermissionDto } from "../types/permission";

export const fetchUserPermissions =
  (userId: number): AppThunk =>
  async (dispatch) => {
    console.log("This this fetchUserPermissions thunk");
    try {
      const resp = await get<PermissionDto[]>(`/permissions/user/${userId}`);
      if (resp.isSuccess) {
        // convert PermissionDto[] into string[]
        const permissionList = resp.data.map((p) => p.permissionName);
        console.log(
          `User-${userId}'s permisson list: `,
          permissionList.join(",")
        );
        dispatch(setPermissions(permissionList));
      }
    } catch (err) {
      console.error(`Failed to fetch user-${userId}'s permission`, err);
    }
  };
