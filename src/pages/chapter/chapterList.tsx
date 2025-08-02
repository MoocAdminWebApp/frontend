import * as React from "react";
import {
  DataGrid,
  GridColDef,
  GridPaginationModel,
} from "@mui/x-data-grid";

interface PagedResult<T> {
  items: T[];
  total: number;
}

interface ChapterListProps<T> {
  loading?: boolean;
  page?: number;
  pageSize?: number;
  pageSizeOptions?: number[];
  pagedResult: PagedResult<T>;
  columns: GridColDef[];
  onPaginationModelChange?: (newModel: GridPaginationModel) => void;
}

function ChapterList<T>(props: ChapterListProps<T>) {
  const pageSize = props.pageSize ?? 10;
  const page = props.page ?? 0;
  const pageSizeOptions = props.pageSizeOptions ?? [10, 20, 50, 100];

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
        if (props.onPaginationModelChange) {
          props.onPaginationModelChange(newModel);
        }
      }}
      pagination
      disableRowSelectionOnClick
      autoHeight
    />
  );
}

export default ChapterList;
