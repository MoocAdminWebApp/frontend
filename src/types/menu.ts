
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

