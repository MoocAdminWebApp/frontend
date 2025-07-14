import * as React from "react";
import { DataGrid, GridColDef, GridPaginationModel } from "@mui/x-data-grid";
import { PagedResultDto } from "../../types/types";
import { CourseOfferingDto } from "../../types/courseOffering";

interface CourseOfferingListProps{
    loading?: boolean;
    page?: number;
    pageSize?: number;
    pageSizeOptions?:number[];
    pagedResult:PagedResultDto<CourseOfferingDto>;
    columns:GridColDef[];
    onPaginationModelChange?:(newModel:GridPaginationModel)=>void;
}

const CourseOfferingList:React.FC<CourseOfferingListProps> = (props) =>{
    const pageSize=props.pageSize ?? 10;
    const page=props.page ?? 0;
    const pageSizeOptions=props.pageSizeOptions ?? [10,20,50,100];

    return(
        <DataGrid
            loading={props.loading || false}
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

export default CourseOfferingList