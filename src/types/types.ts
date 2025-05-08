import { Gender } from "./enum";

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

export interface ListResultDto<T> {
  items: T[];
}

export interface PagedResultDto<T> extends ListResultDto<T> {
  total: number;
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
