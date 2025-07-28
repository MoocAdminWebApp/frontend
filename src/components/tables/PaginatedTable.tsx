// src/components/tables/PaginatedTable.tsx

import React, { useState } from "react";
import { DataGrid, GridColDef, GridPaginationModel } from "@mui/x-data-grid";
import { CustomColumn, renderCellByType } from "./SimpleTable";

//Define the component props, including rows and columns and optional edit/delete handlers
interface PaginatedTableProps {
  rows: any[];
  columns: CustomColumn[];
  paginationModel?: GridPaginationModel;
  onPaginationModelChange?: (model: GridPaginationModel) => void;
  onEdit?: (row: any) => void;
  onDelete?: (row: any) => void;
  defaultPageSize?: number;
  totalCount?: number;
  loading?: boolean;
}

const PaginatedTable: React.FC<PaginatedTableProps> = ({
  rows,
  columns,
  onEdit,
  onDelete,
  paginationModel: externalPaginationModel,
  onPaginationModelChange,
  defaultPageSize = 10,
  loading,
  totalCount,
}) => {
  const [internalPaginationModel, setInternalPaginationModel] =
    useState<GridPaginationModel>({
      page: 0,
      pageSize: defaultPageSize,
    });

  const paginationModel = externalPaginationModel ?? internalPaginationModel;

  const handlePaginationChange = (newModel: GridPaginationModel) => {
    if (onPaginationModelChange) {
      onPaginationModelChange(newModel);
    } else {
      setInternalPaginationModel(newModel);
    }
  };

  const gridColumns: GridColDef[] = columns.map((col) => ({
    field: col.field,
    headerName: col.headerName,
    width: col.width || 150,
    sortable: true,
    renderCell: renderCellByType(
      col.type || "text",
      col.field,
      onEdit,
      onDelete
    ),
  }));

  return (
    <DataGrid
      rows={rows}
      columns={gridColumns}
      checkboxSelection
      disableRowSelectionOnClick
      paginationModel={paginationModel}
      onPaginationModelChange={handlePaginationChange}
      pageSizeOptions={[10, 20, 50]}
      getRowId={(row) => row.id}
      rowCount={totalCount}
      loading={loading}
      paginationMode="server"
    />
  );
};

export default PaginatedTable;
