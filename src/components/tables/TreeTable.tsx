// src/components/tables/TreeTable.tsx

import React, { useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Typography, Chip, IconButton, Box } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { MenuType, StatusType } from "../../types/enum";
import { TreeNode, FlatNode } from "../../types/types";
import { ColumnType, CustomColumn, renderCellByType } from "./SimpleTable";

import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

// export interface TreeNode {
//   id: number;
//   title: string;
//   parentId: number | null;
//   children?: TreeNode[];
// }

// export interface FlatNode {
//   id: number;
//   title: string;
//   parentId: number | null;
//   level: number;
//   orderNum: number;
// }

//Define the component props, including rows and columns and optional edit/delete handlers
interface TreeTableProps {
  rows: any[];
  columns: CustomColumn[];
  level?: number;
  expand?: boolean;
  onEdit?: (row: any) => void;
  onDelete?: (row: any) => void;
  loading?: boolean;
}

const TreeTable: React.FC<TreeTableProps> = ({ rows, columns }) => {
  const gridColumns: GridColDef[] = columns.map((col) => ({
    field: col.field,
    headerName: col.headerName,
    width: col.width || 150,
    sortable: true,
    renderCell: renderCellByType(col.type || "text", col.field),
  }));

  return (
    <DataGrid
      rows={rows}
      columns={gridColumns}
      hideFooter
      disableRowSelectionOnClick
      getRowId={(row) => row.id}
    />
  );
};

export default TreeTable;
