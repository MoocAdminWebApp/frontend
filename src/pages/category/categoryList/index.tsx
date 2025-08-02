import React from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import { GridColDef } from "@mui/x-data-grid";
import CategoryTable from "./categoryTable";
import CategoryDetailDialog from "./categoryDetailsDialog";
import { fetchRootCategories, fetchChildrenCategories, restoreCategoryById } from "../../../request/category";
import { Category } from "../../../types/category";
import { Box, Chip, IconButton, Typography } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import RestoreIcon from "@mui/icons-material/Restore";
import SubdirectoryArrowRightIcon from "@mui/icons-material/SubdirectoryArrowRight";
import { FilterPagedResultRequestDto, PagedResultDto } from "../../../types/types";
import { GridPaginationModel } from "@mui/x-data-grid";
import { jwtDecode } from "jwt-decode";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import CategoryEditDialog from "./categoryEditDialog";
import DeleteConfirmationDialog from "./deleteConfirmationDialog";
import toast from "react-hot-toast";

interface RoleInfo {
  createdAt: string;
  createdBy: number;
  description: string;
  id: number;
  roleName: string;
  status: true;
  updatedAt: string;
  updatedBy: number;
}

interface TokenPayload {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  roles: RoleInfo[];
}

const useUserRoles = (): RoleInfo[] => {
  const tokenFromRedux = useSelector((state: RootState) =>
    state.auth.isAuth ? localStorage.getItem("accessToken") : null
  );
  const token = tokenFromRedux || localStorage.getItem("accessToken");

  const roles = useMemo<RoleInfo[]>(() => {
    if (!token) return [];
    try {
      const payload = jwtDecode<TokenPayload>(token);
      return payload.roles || [];
    } catch {
      return [];
    }
  }, [token]);

  return roles;
};

interface CategoryListProps {
  reloadTrigger?: number;
  onSelectionChange?: (selectedIds: number[]) => void;
  selectedIds?: number[];
  keyword?: string;
  highlightId?: number | null;
}

const CategoryList: React.FC<CategoryListProps> = ({
  reloadTrigger,
  onSelectionChange,
  selectedIds,
  keyword,
  highlightId,
}) => {
  const roles = useUserRoles();
  const isAdmin = roles.some((r) => r.roleName === "admin");

  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const [editOpen, setEditOpen] = useState(false);
  const [editCategory, setEditCategory] = useState<Category | null>(null);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

  const [loading, setLoading] = useState<boolean>(false);
  const [filterPagedResultRequest, setFilterPagedResultRequest] = useState<FilterPagedResultRequestDto>({
    page: 1,
    pageSize: 10,
    filter: "",
  });

  const [searchParams] = useSearchParams();

  useEffect(() => {
    const pageParam = searchParams.get("page");
    const pageSizeParam = searchParams.get("pageSize");
    const idParam = searchParams.get("id");

    setFilterPagedResultRequest({
      page: pageParam ? parseInt(pageParam, 10) : 1,
      pageSize: pageSizeParam ? parseInt(pageSizeParam, 10) : 10,
      filter: keyword || "",
    });

    if (idParam) {
      setSelectedId(Number(idParam));
    }
  }, [searchParams, keyword]);

  const [pageData, setPageData] = useState<PagedResultDto<Category>>({
    items: [],
    total: 0,
  });

  useEffect(() => {
    const getPageData = async () => {
      setLoading(true);
      try {
        const pageParam = searchParams.get("page");
        const pageSizeParam = searchParams.get("pageSize");

        const page = pageParam ? parseInt(pageParam, 10) : 1;
        const pageSize = pageSizeParam ? parseInt(pageSizeParam, 10) : 10;
        const filter = keyword || "";

        const resp = id
          ? await fetchChildrenCategories(Number(id), page, pageSize, filter)
          : await fetchRootCategories(page, pageSize, filter);

        setPageData({
          items: resp.categories,
          total: resp.total,
        });

        const idParam = searchParams.get("id");
        setSelectedId(idParam ? Number(idParam) : null);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      } finally {
        setLoading(false);
      }
    };

    getPageData();
  }, [searchParams, id, keyword, reloadTrigger]);

  const baseColumns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 50 },
    {
      field: "name",
      headerName: "Name",
      minWidth: 130,
      flex: 1,
      renderCell: (params) => (
        <Box display="flex" alignItems="center">
          {params.row.icon && (
            <img
              src={params.row.icon}
              alt={`Icon for ${params.row.name}`}
              style={{ width: 20, height: 20, marginRight: 8 }}
            />
          )}
          {params.value}
        </Box>
      ),
    },
    { field: "description", headerName: "Description", minWidth: 130, flex: 2 },
  ];

  const adminOnlyColumns: GridColDef[] = [
    {
      field: "isPublic",
      headerName: "Visibility",
      minWidth: 110,
      flex: 1,
      renderCell: (p) => <Chip label={p.value ? "Public" : "Hidden"} size="small" />,
    },
    {
      field: "isDeleted",
      headerName: "Status",
      minWidth: 100,
      flex: 1,
      renderCell: (p) => <Chip label={p.value ? "Deleted" : "Active"} size="small" />,
    },
  ];

  const trailingColumns: GridColDef[] = [
    {
      field: "createdAt",
      headerName: "Created At",
      minWidth: 150,
      flex: 1,
      renderCell: (p) => <Typography>{new Date(p.value as string).toLocaleString()}</Typography>,
    },
    {
      field: "updatedAt",
      headerName: "Updated At",
      minWidth: 150,
      flex: 1,
      renderCell: (p) => <Typography>{new Date(p.value as string).toLocaleString()}</Typography>,
    },
    {
      field: "actions",
      headerName: "Actions",
      minWidth: 180,
      flex: 1,
      sortable: false,
      renderCell: (p) => {
        const row = p.row as Category;
        return (
          <Box>
            <IconButton onClick={() => handleView(row)}>
              <VisibilityIcon />
            </IconButton>

            {/* Only admin can see these buttons */}
            {isAdmin && (
              <>
                <IconButton>
                  <EditIcon onClick={() => handleEdit(row)} />
                </IconButton>
                {row.isDeleted ? (
                  <IconButton>
                    <RestoreIcon onClick={() => handleRestore(row)} />
                  </IconButton>
                ) : (
                  <IconButton onClick={() => handleDelete(row)}>
                    <DeleteIcon />
                  </IconButton>
                )}
              </>
            )}

            {/* Show arrow button if the category has child */}
            {row.hasChildren && (
              <IconButton onClick={() => handleViewChildren(row)}>
                <SubdirectoryArrowRightIcon />
              </IconButton>
            )}
          </Box>
        );
      },
    },
  ];

  const columns = [...baseColumns, ...(isAdmin ? adminOnlyColumns : []), ...trailingColumns];

  const handleViewChildren = (category: Category) => {
    navigate(`/category/${category.id}/children`);
  };

  const handleView = (category: Category) => {
    setSelectedId(category.id);
    setDetailOpen(true);
  };

  const handleEdit = (category: Category) => {
    setEditCategory(category);
    setEditOpen(true);
  };

  const handleDelete = (category: Category) => {
    setCategoryToDelete(category);
    setDeleteOpen(true);
  };

  const onDeleteSuccess = () => {
    if (!categoryToDelete) return;
    setPageData((prev) => ({
      ...prev,
      items: prev.items.map((c) => (c.id === categoryToDelete.id ? { ...c, isDeleted: true } : c)),
    }));
    setCategoryToDelete(null);
  };

  const handleRestore = async (category: Category) => {
    try {
      const restored = await restoreCategoryById(category.id);
      setPageData((prev) => ({
        ...prev,
        items: prev.items.map((c) => (c.id === category.id ? restored : c)),
      }));
      toast.success("Category restored");
    } catch (error: any) {
      toast.error(error?.message || "Failed to restore category");
    }
  };

  const onPaginationModelChange = (newModel: GridPaginationModel) => {
    setFilterPagedResultRequest((preState) => {
      return {
        ...preState,
        page: newModel.page + 1,
        pageSize: newModel.pageSize,
      };
    });
  };

  return (
    <>
      <CategoryTable
        loading={loading}
        columns={columns}
        pagedResult={pageData}
        page={filterPagedResultRequest.page - 1}
        pageSize={filterPagedResultRequest.pageSize}
        onPaginationModelChange={onPaginationModelChange}
        isAdmin={isAdmin}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onViewChildren={handleViewChildren}
        onSelectionChange={onSelectionChange}
        selectedIds={selectedIds}
        getRowClassName={(params) => (params.row.id === highlightId ? "Mui-selected-category" : "")}
      />

      <CategoryDetailDialog
        open={detailOpen}
        categoryId={selectedId}
        isAdmin={isAdmin}
        onClose={() => setDetailOpen(false)}
      />

      <CategoryEditDialog
        open={editOpen}
        category={editCategory}
        onClose={() => setEditOpen(false)}
        onSaveSuccess={() => {
          setEditOpen(false);
          setEditCategory(null);
          setFilterPagedResultRequest((prev) => ({
            ...prev,
          }));
        }}
      />

      <DeleteConfirmationDialog
        open={deleteOpen}
        category={categoryToDelete}
        onClose={() => setDeleteOpen(false)}
        onConfirm={onDeleteSuccess}
      />
    </>
  );
};

export default CategoryList;
