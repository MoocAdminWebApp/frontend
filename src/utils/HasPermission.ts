

export function hasPermission(permission: string, assignedPermissions: string[]): boolean {
//   const permissions = getStoredPermissions();
  return assignedPermissions.includes(permission);
}

// usage

// bind to component to determine whether displaying it
    // e.g. 
    //   {hasPermission("permission:viewall",rolePermissions) && (
    //     <IconButton onClick={() => handleEdit(row)}>
    //       <EditIcon />
    //     </IconButton>
    //   )}

export function hasAllPermissions(required: string[], assignedPermissions: string[]): boolean {
//   const permissions = getStoredPermissions();
  return required.every((r) => assignedPermissions.includes(r));
}