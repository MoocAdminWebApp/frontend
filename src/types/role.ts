import { BaseEntityDto } from "./types";

export interface RoleDto extends BaseEntityDto {
  roleName: string;
  mark: string;
}

export interface RoleDetailDto extends BaseEntityDto {
  roleName: string;
  mark: string;
  rolePermissionMenuId: number[];
}

export interface CreateOrUpdateRoleBaseDto extends BaseEntityDto {
  roleName: string;
  mark: string;
}

export interface CreateRoleDto extends RoleDto {}

export interface UpdateRoleDto extends RoleDto {}

export interface RolePermissionInput extends BaseEntityDto {
  menuIds: number[];
}

export interface RolePermissionInput extends BaseEntityDto {
  menuIds: number[];
}
