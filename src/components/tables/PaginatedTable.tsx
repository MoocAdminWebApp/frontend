// src/components/tables/PaginatedTable.tsx

import React, { useState } from "react";
import { DataGrid, GridColDef, GridPaginationModel } from "@mui/x-data-grid";
import { Typography, Chip, IconButton, Box } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { MenuType, StatusType } from "../../types/enum";

// Define the types for the column types
export type ColumnType = "text" | "action" | "chip";

// Define the interface for the custom column
export interface CustomColumn {
  field: string;
  headerName: string;
  flex?: number;
  width?: number;
  type?: ColumnType;
  totalCount?: number;
}

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

// Returns renderCell function based on column type
export const renderCellByType = (
  type: ColumnType,
  field: string,
  onEdit?: (row: any) => void,
  onDelete?: (row: any) => void
): GridColDef["renderCell"] => {
  return (params) => {
    const value = params.row[field];

    switch (type) {
      case "text":
        /// Render permissionInfo as a Typography component (converting to string))
        if (field === "permissionInfo") {
          return (
            <Typography>{params.row.permissionInfo?.title || "N/A"}</Typography>
          );
        }
        // Render date in a specific format(DD/MM/YYYY HH:MM) for createdAt field
        if (field === "createdAt" && value) {
          const date = new Date(value);
          const day = String(date.getDate()).padStart(2, "0");
          const month = String(date.getMonth() + 1).padStart(2, "0");
          const year = date.getFullYear();
          const hour = String(date.getHours()).padStart(2, "0");
          const minute = String(date.getMinutes()).padStart(2, "0");
          return (
            <Typography>
              {`${day}/${month}/${year} ${hour}:${minute}`}
            </Typography>
          );
        }

        return <Typography>{value}</Typography>;

      case "chip":
        let chipColor: "primary" | "success" | "error";
        // Render a Chip component for chip type
        if (field === "type") {
          return (
            <Chip
              label={MenuType[value] || value}
              variant="outlined"
              size="small"
              sx={{
                width: 60,
                justifyContent: "center",
                fontSize: "13px",
                borderRadius: "8px",
                fontWeight: 500,
              }}
            />
          );
        }
        if (field === "status") {
          switch (value) {
            case StatusType.Active:
              chipColor = "success"; // Active
              break;
            case StatusType.Draft:
              chipColor = "primary"; // Draft
              break;
            case StatusType.Deleted:
              chipColor = "error"; // Deleted
              break;
            default:
              chipColor = "primary";
          }
          return (
            <Chip
              label={StatusType[value] || value}
              color={chipColor as any}
              variant="outlined"
              size="small"
              sx={{
                width: 90,
                justifyContent: "center",
                fontSize: "13px",
                borderRadius: "8px",
                fontWeight: 500,
              }}
            />
          );
        }
        // Default chip rendering for other fields
        return (
          <Chip
            label={value}
            variant="outlined"
            size="small"
            sx={{ borderRadius: "8px", fontWeight: 500 }}
          />
        );

      case "action":
        // Render action buttons for edit and delete
        return (
          <Box>
            <IconButton onClick={() => onEdit?.(params.row)} size="small">
              <EditIcon sx={{ color: "primary.main" }} />
            </IconButton>
            <IconButton onClick={() => onDelete?.(params.row)} size="small">
              <DeleteIcon sx={{ color: "error.main" }} />
            </IconButton>
          </Box>
        );

      default:
        return value;
    }
  };
};

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
