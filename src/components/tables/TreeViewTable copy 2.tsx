// src/components/tables/TreeViewTable.tsx

import React, { useState } from "react";
import { RichTreeView } from "@mui/x-tree-view/RichTreeView";
import { TreeViewBaseItem } from "@mui/x-tree-view/models";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Typography, Chip, IconButton, Box } from "@mui/material";

import { convertDateFormat } from "../../utils/convertDateFormat";
import { ColumnType, CustomColumn, renderCellByType } from "./SimpleTable";

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
  // columns,
  isItemEditable = false,
  defaultExpandedItems = [],
}) => {
  // const gridColumns: GridColDef[] = columns.map((col) => ({
  //   field: col.field,
  //   headerName: col.headerName,
  //   width: col.width || 150,
  //   sortable: true,
  //   renderCell: renderCellByType(col.type || "text", col.field),
  // }));

  return (
    <RichTreeView items={items} defaultExpandedItems={defaultExpandedItems} />
  );
};

export default TreeViewTable;
