import React from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { FlatNode } from "../../types/types";
import { ExpandState } from "../../types/enum";
import { ColumnType, CustomColumn, renderCellByType } from "./SimpleTable";

interface TreeTableProps {
  rows: FlatNode[];
  columns: CustomColumn[];
  expandMap?: Record<number, ExpandState>;
  onToggleExpand?: (id: number) => void;
  onEdit?: (row: any) => void;
  onDelete?: (row: any) => void;
  loading?: boolean;
}

const TreeTable: React.FC<TreeTableProps> = ({
  rows,
  columns,
  expandMap,
  onToggleExpand,
  onEdit,
  onDelete,
  loading,
}) => {
  const gridColumns: GridColDef[] = columns.map((col) => ({
    field: col.field,
    headerName: col.headerName,
    width: col.width || 150,
    sortable: false,
    renderCell: renderCellByType(
      col.type || "text",
      col.field,
      onEdit,
      onDelete,
      expandMap,
      onToggleExpand,
      true
    ),
  }));

  return (
    <DataGrid
      rows={rows}
      columns={gridColumns}
      hideFooter
      disableRowSelectionOnClick
      getRowId={(row) => row.id}
      loading={loading}
    />
  );
};

export default TreeTable;
