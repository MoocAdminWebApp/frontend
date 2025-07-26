import { MenuType, StatusType } from "./enum";
import { BaseEntityDto } from "./types";

export interface MenuDto extends BaseEntityDto {
  title: string;
  menuType: MenuType;
  parentId?: number | null;
  orderNum: number;
  route?: string;
  componentPath?: string;
  permission: string | null;
  status: StatusType;
  comment: string;
  level: number;
  icon?: React.ElementType;
  children: MenuDto[];
}

export interface CreateOrUpdateMenuBaseDto {
  id: number; // When id==0, it indicates a new addition; otherwise, it indicates an update
  title: string;
  menuType: MenuType;
  parentId?: number | null;
  orderNum: number;
  route?: string;
  componentPath?: string;
  permission: string | null;
  status: StatusType;
  comment: string;
}

export interface CreateMenuDto extends CreateOrUpdateMenuBaseDto {}

export interface UpdateMenuDto extends CreateOrUpdateMenuBaseDto {}
