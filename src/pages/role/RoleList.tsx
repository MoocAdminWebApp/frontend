import * as React from "react";
import {
  DataGrid,
  GridColDef,
  GridPaginationModel,
} from "@mui/x-data-grid";
import { PagedResultDto } from "../../types/types";
import { RoleDto } from "../../types/role";

interface RoleListProps {
  loading?: boolean;
  page?: number;
  pageSize?: number;
  pageSizeOptions?: number[];
  pagedResult: PagedResultDto<RoleDto>;
  columns: GridColDef[];
  onPaginationModelChange?: (newModel: GridPaginationModel) => void;
}

const RoleList: React.FC<RoleListProps> = ({
  loading = false,
  page = 0,
  pageSize = 10,
  pageSizeOptions = [10, 20, 50],
  pagedResult,
  columns,
  onPaginationModelChange,
}) => {
  return (
    <DataGrid
      loading={loading}
      rows={pagedResult.items}
      rowCount={pagedResult.total}
      columns={columns}
      paginationModel={{ page, pageSize }}
      initialState={{
        pagination: {
          paginationModel: {
            pageSize: pageSize,
          },
        },
      }}
      paginationMode="server"
      pageSizeOptions={pageSizeOptions}
      onPaginationModelChange={onPaginationModelChange}
      disableRowSelectionOnClick
      getRowId={(row) => row.id}
    />
  );
};

export default RoleList;
