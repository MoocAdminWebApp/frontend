// src/components/tables/TreeViewTable.tsx

import React, { useState } from "react";
import { RichTreeView } from "@mui/x-tree-view/RichTreeView";
import { TreeViewBaseItem } from "@mui/x-tree-view/models";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Typography, Chip, IconButton, Box } from "@mui/material";

import { convertDateFormat } from "../../utils/convertDateFormat";
import { ColumnType, CustomColumn } from "./SimpleTable";

export interface TreeNode {
  id: number;
  [key: string]: any;
  children?: TreeNode[];
}

interface TreeViewTableProps {
  items: TreeViewBaseItem[];
  // columns: CustomColumn[];
  isItemEditable?: boolean;
  defaultExpandedItems?: string[];
  expandedItems?: string[];
  onExpandedItemsChange?: (newExpanded: string[]) => void;
}

const TreeViewTable: React.FC<TreeViewTableProps> = ({
  items,
  isItemEditable = false,
  defaultExpandedItems = [],
}) => {
  return (
    <RichTreeView items={items} defaultExpandedItems={defaultExpandedItems} />
  );
};

export default TreeViewTable;
