import React, { useState, useEffect } from "react";
import { Box, TextField, Button, CircularProgress } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import CategoryTree from "./categoryTree";
import { Category } from "../../types/category";
import { fetchRootCategories } from "../../request/category";
import { categoryColumns } from "./categoryColumns";
import CategoryDetailDialog from "./categoryDetailsDialog";

const CategoryPage: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>("");
  const [categories, setCategories] = useState<Category[]>([]);

  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  const handleViewCategory = (category: Category) => {
    setSelectedCategory(category);
    setIsDetailOpen(true);
  };

  const handleCloseDetail = () => {
    setIsDetailOpen(false);
    setSelectedCategory(null);
  };

  useEffect(() => {
    const loadCategories = async () => {
      setLoading(true);
      try {
        const data = await fetchRootCategories();
        setCategories(data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setLoading(false);
      }
    };
    loadCategories();
  }, []);

  return (
    <Box sx={{ p: 3, width: "100%", maxWidth: "100%" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <TextField
          variant="outlined"
          placeholder="Search categories..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          InputProps={{ startAdornment: <SearchIcon sx={{ mr: 1 }} /> }}
          sx={{ width: 300 }}
        />
        <Button disabled={loading} variant="contained" startIcon={<AddIcon />}>
          Add Category
        </Button>
      </Box>

      <Box sx={{ width: "100%", mt: 2, overflowX: "auto" }}>
        {/* table header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            fontWeight: "bold",
            backgroundColor: "#f5f5f5",
            borderBottom: "2px solid #ccc",
            width: "100%",
            textAlign: "left",
            px: 2,
          }}
        >
          {categoryColumns.map((col) => (
            <Box
              key={col.key}
              sx={{
                width: col.width,
                textAlign: col.align ?? "left",
                py: 1,
              }}
            >
              {col.label}
            </Box>
          ))}
        </Box>

        {/* table body */}
        {loading ? <CircularProgress /> : <CategoryTree categories={categories} onViewCategory={handleViewCategory} />}

        <CategoryDetailDialog open={isDetailOpen} onClose={handleCloseDetail} category={selectedCategory} />
      </Box>
    </Box>
  );
};

export default CategoryPage;
