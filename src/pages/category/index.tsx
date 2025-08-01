import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, TextField, Button, CircularProgress } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import { Category } from "../../types/category";
import { createCategory, deleteCategories, fetchAllTreeCategories } from "../../request/category";
import CategoryList from "./categoryList";
import CategoryTree from "./categoryTree/index";
import { useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";
import { RootState } from "../../store/store";
import AddCategoryDialog from "./addCategoryDialog";
import toast from "react-hot-toast";
import BulkDeleteConfirmationDialog from "./bulkDeleteConfirmationDialog";
import useDebounce from "../../hooks/useDebounce";

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

const CategoryPage: React.FC = () => {
  const roles = useUserRoles();
  const isAdmin = roles.some((r) => r.roleName === "admin");

  const [loading, setLoading] = useState<boolean>(false);

  const [searchText, setSearchText] = useState<string>("");

  const [treeCategories, setTreeCategories] = useState<Category[]>([]);

  const [addDialogOpen, setAddDialogOpen] = useState<boolean>(false);

  const [reloadTrigger, setReloadTrigger] = useState(0);

  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  const params = useParams();

  const navigate = useNavigate();

  const debouncedSearchText = useDebounce(searchText, 500);

  const handleTreeSelect = useCallback(
    (category: Category) => {
      if (category.parentId === null) {
        navigate("/category");
      } else {
        navigate(`/category/${category.parentId}/children`);
      }
    },
    [navigate]
  );

  const loadCategories = () => {
    setLoading(true);
    fetchAllTreeCategories()
      .then((raw) => setTreeCategories(raw))
      .catch((err) => {
        console.error("Failed to fetch all categories:", err);
        toast.error("Failed to load categories");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadCategories();
  }, [reloadTrigger]);

  const handleCreateCategory = async (formData: Partial<Category>) => {
    try {
      const newCategory = await createCategory(formData);

      toast.success("Category created successfully");
      setAddDialogOpen(false);

      const newParentId = newCategory.parentId ?? null;
      const currentId = params.id ? Number(params.id) : null;

      const newPath = newParentId === null ? "/category" : `/category/${newParentId}/children`;
      const currentPath = currentId === null ? "/category" : `/category/${currentId}/children`;

      if (newPath === currentPath) {
        setReloadTrigger((v) => v + 1);
      } else {
        navigate(newPath);
        setReloadTrigger((v) => v + 1); 
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || "Creation failed");
    }
  };

  const handleConfirmBulkDelete = async () => {
    try {
      await deleteCategories(selectedIds);
      toast.success("Categories deleted successfully");

      setConfirmDeleteOpen(false);
      setSelectedIds([]);
      setReloadTrigger((v) => v + 1);
    } catch (err: any) {
      toast.error(err?.message || "Failed to delete categories");
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Search + Add */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <TextField
          variant="outlined"
          placeholder="Search categories..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          InputProps={{ startAdornment: <SearchIcon sx={{ mr: 1 }} /> }}
          sx={{ width: 300 }}
        />

        {isAdmin && (
          <Box sx={{ display: "flex", gap: 2 }}>
            {selectedIds.length > 0 && (
              <Button sx={{ height: 40 }} variant="outlined" color="error" onClick={() => setConfirmDeleteOpen(true)}>
                Delete
              </Button>
            )}

            <Button
              sx={{ height: 40 }}
              disabled={loading}
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setAddDialogOpen(true)}
            >
              Add Category
            </Button>
          </Box>
        )}
      </Box>

      {/* Tree + CategoryList */}
      <Box sx={{ display: "flex" }}>
        {/* Tree */}
        <Box sx={{ flex: "0 0 20%", minWidth: 300, overflowY: "auto" }}>
          {loading ? <CircularProgress /> : <CategoryTree data={treeCategories} onSelect={handleTreeSelect} />}
        </Box>

        {/* Table */}
        <Box
          sx={{
            flex: 1,
            overflow: "auto",
          }}
        >
          {/* <Box>
            <Outlet />
          </Box> */}
          <CategoryList
            reloadTrigger={reloadTrigger}
            onSelectionChange={setSelectedIds}
            selectedIds={selectedIds}
            keyword={debouncedSearchText}
          />
        </Box>
      </Box>

      <AddCategoryDialog
        open={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        onSubmit={handleCreateCategory}
        parentOptions={treeCategories}
      />

      <BulkDeleteConfirmationDialog
        open={confirmDeleteOpen}
        onClose={() => setConfirmDeleteOpen(false)}
        onConfirm={handleConfirmBulkDelete}
        count={selectedIds.length}
      />
    </Box>
  );
};

export default CategoryPage;
