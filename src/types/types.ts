import { Gender, TreeModule } from "./enum";
import { MenuDto } from "./menu";

export interface ApiResponseResult<T = any> {
  isSuccess: boolean;
  status: number;
  message: string;
  time: Date;
  data: T;
}

export interface BaseEntityDto {
  id: number;
}

export interface BaseTreeEntityDto extends BaseEntityDto {
  parentId?: number | null;
  orderNum: number;
  children?: BaseTreeEntityDto[];
}

export interface ListResultDto<T> {
  items: T[];
}

export interface PagedResultDto<T> extends ListResultDto<T> {
  total: number;
}

export interface FilterResultRequestDto {
  filter?: string;
  sort?: string;
}

export interface FilterPagedResultRequestDto {
  page: number;
  pageSize: number;
  filter?: string;
  sort?: string;
}

/**
 * genders
 */
export const genders = [
  { label: "Other", value: Gender.Other },
  { label: "Male", value: Gender.Male },
  { label: "Female", value: Gender.Female },
];

export interface FilmOptionType {
  id: number;
  title: string;
}

export type TreeModuleDtoMap = {
  [TreeModule.Menu]: MenuDto;
  // [TreeModule.Chapter]: ChapterDto;
};
