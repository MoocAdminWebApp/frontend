export function getPermissionPrefix(permissionName: string): string {
  return permissionName.split(":")[0];
}
