import * as React from "react";
import { DataGrid, GridColDef, GridPaginationModel } from "@mui/x-data-grid";
import { PagedResultDto } from "../../../types/types";
import { Category } from "../../../types/category";

interface CategoryTableProps {
  loading?: boolean;
  page?: number;
  pageSize?: number;
  pageSizeOptions?: number[];
  pagedResult: PagedResultDto<Category>;
  isAdmin: boolean;
  columns: GridColDef[];
  onPaginationModelChange?: (newModel: GridPaginationModel) => void;
  onView: (row: Category) => void;
  onEdit: (row: Category) => void;
  onDelete: (row: Category) => void;
  onViewChildren: (row: Category) => void;
  onSelectionChange?: (selectedIds: number[]) => void;
  selectedIds?: number[];
}

const CategoryTable: React.FC<CategoryTableProps> = ({
  loading,
  page = 0,
  pageSize = 10,
  pageSizeOptions = [10, 20, 50, 100],
  pagedResult,
  columns,
  onPaginationModelChange,
  onView,
  onEdit,
  onDelete,
  onViewChildren,
  onSelectionChange,
  selectedIds,
}) => {
  const rows = pagedResult.items;
  const rowCount = pagedResult.total;

  const paginationModel: GridPaginationModel = { page, pageSize };

  return (
    <DataGrid
      loading={loading}
      rows={rows}
      rowCount={rowCount}
      columns={columns}
      pagination
      paginationMode="server"
      paginationModel={paginationModel}
      onPaginationModelChange={onPaginationModelChange}
      pageSizeOptions={pageSizeOptions}
      checkboxSelection
      disableRowSelectionOnClick
      onRowSelectionModelChange={(newSelection) => {
        onSelectionChange?.(newSelection as number[]);
      }}
      rowSelectionModel={selectedIds}
      autoHeight
    />
  );
};

export default CategoryTable;
