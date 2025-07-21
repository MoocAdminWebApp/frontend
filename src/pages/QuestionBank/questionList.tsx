import * as React from "react";
import {
  DataGrid,
  GridColDef,
  GridPaginationModel,
  GridRowSelectionModel
} from "@mui/x-data-grid";

import { PagedResultDto } from "../../types/types";
import { QuestionDto } from "../../types/question"

interface UserListProps {
  loading?: boolean;
  page?: number;
  pageSize?: number;
  pageSizeOptions?: number[];
  pagedResult: PagedResultDto<QuestionDto>;
  columns: GridColDef[];
  onPaginationModelChange?: (newModel: GridPaginationModel) => void;
  rowSelectionModel: GridRowSelectionModel
  onRowSelectionModelChange?: (newModel: GridRowSelectionModel) => void;
}

const QuestionList: React.FC<UserListProps> = (props) => {
  let pageSize = props.pageSize ?? 10; // default value
  let page = props.page ?? 0; // default value

  let pageSizeOptions = props.pageSizeOptions ?? [10, 20, 50, 100]; // default value
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
      pageSizeOptions={pageSizeOptions}
      onPaginationModelChange={(newModel) => {
        props.onPaginationModelChange &&
          props.onPaginationModelChange(newModel);
      }}
      pagination
      disableRowSelectionOnClick
      checkboxSelection
      rowSelectionModel={props.rowSelectionModel}
      onRowSelectionModelChange={(newRowSelectionModel) => {
        props.onRowSelectionModelChange &&
        props.onRowSelectionModelChange(newRowSelectionModel)
      }}

    />
  );
};

export default QuestionList;
