import * as React from "react";
import {
  DataGrid,
  GridColDef,
  GridPaginationModel,
  GridRowId,
} from "@mui/x-data-grid";
import { PagedResultDto } from "../../types/types";
import { DemoDto } from "../../types/demo";

interface UserListProps {
  loading?: boolean;
  page?: number;
  pageSize?: number;
  pageSizeOptions?: number[];
  pagedResult: PagedResultDto<DemoDto>;
  columns: GridColDef[];
  onPaginationModelChange?: (newModel: GridPaginationModel) => void;
}

const DemoList: React.FC<UserListProps> = (props) => {
  let pageSize = props.pageSize ?? 10; // default value
  let page = props.page ?? 0; // default value

  let ageSizeOptions = props.pageSizeOptions ?? [10, 20, 50, 100]; // default value
  return (
    <DataGrid
      loading={props.loading || false}
      rows={props.pagedResult.items}
      rowCount={props.pagedResult.total}
      columns={props.columns}
      paginationModel={{ page: page, pageSize: pageSize }}
      initialState={{
        pagination: {
          paginationModel: {
            pageSize: pageSize,
          },
        },
      }}
      paginationMode="server"
      pageSizeOptions={ageSizeOptions}
      onPaginationModelChange={(newModel) => {
        props.onPaginationModelChange &&
          props.onPaginationModelChange(newModel);
      }}
      pagination
      disableRowSelectionOnClick
    />
  );
};

export default DemoList;
