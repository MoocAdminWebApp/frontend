
export interface PermissionDto{
    id:number;
    permissionName:string;
    description:string;
}

export interface CreatePermissionDto{
   permissionName:string;
    description:string;
}

export interface UpdatePermissionDto extends CreatePermissionDto{
    id:number;
}
