import * as React from "react";
import {
  DataGrid,
  GridColDef,
  GridPaginationModel,
  GridRowId,
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

const RoleList: React.FC<RoleListProps> = (props) => {
  const pageSize = props.pageSize ?? 10;
  const page = props.page ?? 0;
  const pageSizeOptions = props.pageSizeOptions ?? [10, 20, 50];

  return (
    <DataGrid
      loading={props.loading || false}
      rows={props.pagedResult.items}
      rowCount={props.pagedResult.total}
      columns={props.columns}
      paginationModel={{ page, pageSize }}
      paginationMode="server"
      pageSizeOptions={pageSizeOptions}
      onPaginationModelChange={props.onPaginationModelChange}
      disableRowSelectionOnClick
    />
  );
};

export default RoleList;
