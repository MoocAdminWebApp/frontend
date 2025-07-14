import { MenuType } from "./enum";
import { BaseEntityDto } from "./types";

export interface MenuDto extends BaseEntityDto {
  title: string;
  permission: string;
  mark: string;
  orderNum: number;
  menuType: MenuType;
  route?: string;
  componentPath?: string;
  parentId?: number | null;
  level: number;
  icon?: React.ElementType;
  children: MenuDto[];
}

export interface CreateOrUpdateMenuBaseDto extends BaseEntityDto {
  title: string;
  permission: string;
  mark: string;
  menuType: MenuType;
  route?: string;
  componentPath?: string;
  orderNum: number;
  parentId?: number;
}

export interface CreateMenuDto extends CreateOrUpdateMenuBaseDto {}

export interface UpdateMenuDto extends CreateOrUpdateMenuBaseDto {}

export interface UserPermissionDto {
  menus: Array<MenuDto>;
  permissions: Array<string>;
}
