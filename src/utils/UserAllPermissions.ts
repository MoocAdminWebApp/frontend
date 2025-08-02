import { get } from "../request/axios";
import { ApiResponseResult } from "../types/types"; 

interface Permission {
  permissionId: number;
  permissionName: string;
}

export default async function GetAndStoreRolePermissions(roleId: number): Promise<void> {
  try {
    const res: ApiResponseResult<{ permissions: Permission[] } | null> =
      await get(`/permissions/role/${roleId}/permissions`);

    // 如果后端返回 null 或没有 permissions 字段
    if (!res?.data || !Array.isArray(res.data.permissions)) {
      console.warn("No permissions returned for role", roleId);
      localStorage.removeItem(`role_permissions_${roleId}`); // 可选：清理旧缓存
      return;
    }

    const fetchedPermissions = res.data.permissions;

    const permissionNames = fetchedPermissions.map((p) => p.permissionName);

    localStorage.setItem(
      `role_permissions_${roleId}`,
      JSON.stringify(permissionNames)
    );
  } catch (err) {
    console.error("Failed to fetch permissions:", err);
    throw err;
  }
}