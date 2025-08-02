import React from "react";
import { useMemo } from "react";
import { SimpleTreeView, TreeItem } from "@mui/x-tree-view";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { Box } from "@mui/material";
import { Category, CategoryNode } from "../../../types/category";
import buildCategoryTree from "./utils";

interface CategoryTreeProps {
  data: Category[];
  onSelect?: (category: Category) => void;
}

const CategoryTree: React.FC<CategoryTreeProps> = ({ data, onSelect }) => {
  const treeData = useMemo<CategoryNode[]>(() => buildCategoryTree(data), [data]);

  const renderTree = (nodes: CategoryNode[]) =>
    nodes.map((node) => (
      <TreeItem
        key={node.id}
        itemId={String(node.id)}
        label={
          <Box
            component="span"
            onClick={(e) => {
              e.stopPropagation();
              onSelect?.(node);
            }}
            sx={{ cursor: "pointer", ":hover": { textDecoration: "underline" } }}
          >
            {node.name}
          </Box>
        }
      >
        {node.children.length > 0 && renderTree(node.children)}
      </TreeItem>
    ));

  return (
    <SimpleTreeView
      slots={{
        collapseIcon: ExpandMoreIcon,
        expandIcon: ChevronRightIcon,
      }}
      sx={{ flexGrow: 1, overflowY: "auto" }}
    >
      {renderTree(treeData)}
    </SimpleTreeView>
  );
};

export default CategoryTree;
