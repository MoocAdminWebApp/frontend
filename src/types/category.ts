import { BaseEntityDto } from "./types";

export interface Category extends BaseEntityDto {
  name: string;
  description?: string;
  icon?: string | null;
  parentId?: number | null;
  isPublic?: boolean;
  isDeleted?: boolean;
  createdBy?: number;
  updatedBy?: number;
  deletedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
}