import { get } from "./axios";
import { Category } from "../types/category";
import { PagedResultDto } from "../types/types";

const fetchRootCategories = async (): Promise<Category[]> => {
  const res = await get<PagedResultDto<Category>>("/categories/root");

  if (res.isSuccess) {
    return res.data.items ?? [];
  }

  throw new Error(res.message || "Failed to fetch root categories");
};

const fetchChildrenCategories = async (parentId: number): Promise<Category[]> => {
  const res = await get<PagedResultDto<Category>>(`/categories/${parentId}/children`);

  if (res.isSuccess) {
    return res.data.items ?? [];
  }

  throw new Error(res.message || `Failed to fetch children categories for parent ID ${parentId}`);
};

export { fetchRootCategories, fetchChildrenCategories };
