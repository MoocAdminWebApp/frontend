import { get, del, put, post } from "./axios";
import { Category } from "../types/category";
import { ApiResponseResult, PagedResultDto } from "../types/types";

interface UpdateCategoryPayload {
  name: string;
  description?: string;
  icon?: string;
  isPublic: boolean;
}

const createCategory = async (data: Partial<Category>): Promise<Category> => {
  const res: ApiResponseResult<Category> = await post("/categories", data);

  if (!res.isSuccess) {
    throw new Error(res.message || "Failed to create category");
  }

  return res.data;
};

const fetchAllTreeCategories = async (): Promise<Category[]> => {
  const res = await get<Category[]>("/categories/tree");

  if (res.isSuccess) {
    return res.data ?? [];
  }

  throw new Error(res.message || "Failed to fetch all categories");
};

const fetchAllCategories = async (
  page?: number,
  pageSize?: number,
  filter?: string
): Promise<{ categories: Category[]; total: number }> => {
  const res = await get<PagedResultDto<Category>>("/categories", {
    page,
    pageSize,
    keyword: filter,
  });
  if (res.isSuccess) {
    return {
      categories: res.data.items ?? [],
      total: res.data.total,
    };
  }
  throw new Error(res.message || "Failed to fetch categories");
};

const fetchRootCategories = async (
  page?: number,
  pageSize?: number,
  filter?: string
): Promise<{ categories: Category[]; total: number }> => {
  const res = await get<PagedResultDto<Category>>("/categories/root", {
    page,
    pageSize,
    keyword: filter,
  });

  if (res.isSuccess) {
    return {
      categories: res.data.items ?? [],
      total: res.data.total,
    };
  }

  throw new Error(res.message || "Failed to fetch root categories");
};

const fetchChildrenCategories = async (
  parentId: number,
  page?: number,
  pageSize?: number,
  filter?: string
): Promise<{ categories: Category[]; total: number }> => {
  const res = await get<PagedResultDto<Category>>(`/categories/${parentId}/children`, {
    page,
    pageSize,
    keyword: filter,
  });

  if (res.isSuccess) {
    return {
      categories: res.data.items ?? [],
      total: res.data.total,
    };
  }

  throw new Error(res.message || `Failed to fetch children categories for parent ID ${parentId}`);
};

const fetchCategoryById = async (id: number): Promise<Category> => {
  const res = await get<Category>(`/categories/${id}`);
  if (res.isSuccess) {
    return res.data;
  }
  throw new Error(res.message || `Failed to fetch category ${id}`);
};

const updateCategoryById = async (id: number, data: UpdateCategoryPayload): Promise<void> => {
  await put(`/categories/${id}`, data);
};

const deleteCategoryById = async (id: number): Promise<Category> => {
  const res = await del<Category>(`/categories/${id}`);

  if (res.isSuccess) {
    return res.data;
  }

  throw new Error(res.message || `Failed to delete category ${id}`);
};

const deleteCategories = async (ids: number[]): Promise<Category[]> => {
  const res = await del<Category[]>("/categories", { ids });
  if (res.isSuccess) {
    return res.data ?? [];
  }

  throw new Error(res.message || "Failed to delete categories");
};

const restoreCategoryById = async (id: number): Promise<Category> => {
  const res = await put<Category>(`/categories/${id}/restore`);

  if (res.isSuccess) {
    return res.data;
  }

  throw new Error(res.message || `Failed to restore category ${id}`);
};

const getCategoryPageById = async (id: number, pageSize = 10, keyword = ""): Promise<number> => {
  const res = await get<{ page: number }>(`/categories/${id}/page`, {
    pageSize,
    keyword,
  });

  const page = res.data?.page;

  if (typeof page !== "number") {
    throw new Error("Invalid response from getCategoryPageById");
  }

  return page;
};

export {
  createCategory,
  fetchAllTreeCategories,
  fetchAllCategories,
  fetchRootCategories,
  fetchChildrenCategories,
  fetchCategoryById,
  updateCategoryById,
  deleteCategoryById,
  deleteCategories,
  restoreCategoryById,
  getCategoryPageById,
};
