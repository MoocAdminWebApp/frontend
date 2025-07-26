import React from "react";
import { Box, Typography, Avatar, IconButton } from "@mui/material";
import { Category } from "../../types/category";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { getColumnWidth, getColumnAlign } from "./categoryColumns";

interface CategoryRowProps {
  category: Category;
  level?: number;
  onToggle?: (id: number) => void;
  isExpanded?: boolean;
  hasChildren?: boolean;
  onViewCategory?: (category: Category) => void;
}

const CategoryRow: React.FC<CategoryRowProps> = ({
  category,
  level,
  onToggle,
  hasChildren,
  isExpanded,
  onViewCategory,
}) => {
  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        py: 1,
        px: 2,
        borderBottom: "1px solid #eee",
      }}
    >
      <Box sx={{ width: getColumnWidth("id"), textAlign: getColumnAlign("id") }}>{category.id}</Box>

      <Box sx={{ width: getColumnWidth("name"), display: "flex", alignItems: "center", justifyContent: "flex-start" }}>
        <Box sx={{ pl: `${(level ?? 0) * 20}px`, display: "flex", alignItems: "center", justifyContent: "flex-start" }}>
          {hasChildren && (
            <IconButton onClick={() => onToggle?.(category.id)} size="small" sx={{ pl: 0 }}>
              {isExpanded ? <KeyboardArrowDownIcon /> : <KeyboardArrowRightIcon />}
            </IconButton>
          )}

          {category.icon ? (
            <Avatar src={category.icon} sx={{ width: 24, height: 24, mr: 1 }} />
          ) : (
            <Box sx={{ width: 24, height: 24, mr: 1 }} />
          )}
          <Typography>{category.name}</Typography>
        </Box>
      </Box>

      <Box sx={{ width: getColumnWidth("public"), textAlign: getColumnAlign("public") }}>
        <Typography variant="body2">{category.isPublic ? "Yes" : "No"}</Typography>
      </Box>

      <Box sx={{ width: getColumnWidth("createdAt"), textAlign: getColumnAlign("createdAt") }}>
        <Typography variant="body2">
          {category.createdAt ? new Date(category.createdAt).toLocaleString() : "--"}
        </Typography>
      </Box>

      <Box
        sx={{
          width: getColumnWidth("action"),
          textAlign: getColumnAlign("action"),
          display: "flex",
          gap: 1,
          justifyContent: "flex-start",
        }}
      >
        <IconButton size="small" sx={{ pl: 0 }}>
          <EditIcon fontSize="small" />
        </IconButton>
        <IconButton size="small">
          <DeleteIcon fontSize="small" />
        </IconButton>
        <IconButton size="small" onClick={() => onViewCategory?.(category)}>
          <VisibilityIcon fontSize="small" />
        </IconButton>
      </Box>
    </Box>
  );
};

export default CategoryRow;
