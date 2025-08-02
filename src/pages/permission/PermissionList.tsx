import * as React from "react";
import { DataGrid, GridColDef, GridPaginationModel } from "@mui/x-data-grid";
import { PagedResultDto } from "../../types/types";
import { PermissionDto } from "../../types/permission";

interface PermissionListProps<T=any>{
    loading?: boolean;
    page?: number;
    pageSize?: number;
    pageSizeOptions?:number[];
    pagedResult:PagedResultDto<PermissionDto>;
    columns:GridColDef[];
    onPaginationModelChange?:(newModel:GridPaginationModel)=>void;
}

const PermissionList=<T,>(props:PermissionListProps<T>) =>{
    const pageSize=props.pageSize ?? 10;
    const page=props.page ?? 0;
    const pageSizeOptions=props.pageSizeOptions ?? [10,20,50,100];

//    console.log(props.pagedResult);
   

    return(
        <DataGrid
            loading={props.loading || false}
            //
            
            rows={props.pagedResult.items}
            rowCount={props.pagedResult.total}
            columns={props.columns}
            paginationModel={{page:page,pageSize:pageSize}}
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
                props.onPaginationModelChange?.(newModel);
            }}
            pagination
            disableRowSelectionOnClick
            getRowId={(row) => row.id}
        />
    )
}

export default PermissionList