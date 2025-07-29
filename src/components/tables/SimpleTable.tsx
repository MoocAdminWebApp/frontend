// src/components/tables/SimpleTable.tsx

import React, { useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Typography, Chip, IconButton, Box } from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import { MenuType, StatusType, ExpandState } from "../../types/enum";
import { convertDateFormat } from "../../utils/convertDateFormat";

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
interface TableProps {
  rows: any[];
  columns: CustomColumn[];
  onEdit?: (row: any) => void;
  onDelete?: (row: any) => void;
  loading?: boolean;
}

export const renderCellByType = (
  type: ColumnType,
  field: string,
  onEdit?: (row: any) => void,
  onDelete?: (row: any) => void,
  expandMap?: Record<number, ExpandState>,
  onToggleExpand?: (id: number) => void,
  expandable?: boolean
): GridColDef["renderCell"] => {
  return (params) => {
    const { row } = params;
    const raw = row.raw ? row.raw : row;
    const value = raw[field];
    console.log("🔍 field:", field, " | value:", value, " | raw:", raw);

    switch (type) {
      case "text":
        /// Render permissionInfo as a Typography component (converting to string))
        if (field === "permissionInfo") {
          return (
            <Typography>{params.row.permissionInfo?.title || "-"}</Typography>
          );
        }
        // Render date in a specific format(DD/MM/YYYY HH:MM) for createdAt field
        if (field === "createdAt" && value) {
          const dispDate = convertDateFormat(value);
          return <Typography>{`${dispDate}`}</Typography>;
        }

        // Render title, and expansion icons is requested from TreeTable (expandable = true)
        if (field === "title") {
          const row = params.row;
          const level = row.level || 0;
          const id = row.id;
          const iconSize = 20;

          if (expandable) {
            const expandState: ExpandState =
              expandMap?.[id] ?? ExpandState.NonExpandable;

            const handleToggle = (e: React.MouseEvent) => {
              e.stopPropagation();
              onToggleExpand?.(id);
            };

            // Render expand/collapse/no icon correspondingly
            let icon = null;
            if (expandState === ExpandState.NonExpandable) {
              icon = <Box sx={{ width: iconSize }} />;
            } else {
              if (expandState === ExpandState.Expanded) {
                icon = (
                  <IconButton size="small" onClick={handleToggle}>
                    <ExpandLessIcon fontSize="small" />
                  </IconButton>
                );
              } else {
                icon = (
                  <IconButton size="small" onClick={handleToggle}>
                    <ChevronRightIcon fontSize="small" />
                  </IconButton>
                );
              }
            }

            return (
              <Box
                sx={{ display: "flex", alignItems: "center", pl: level * 2 }}
              >
                {icon}
                <Typography variant="body2" sx={{ ml: 1 }}>
                  {row.title}
                </Typography>
              </Box>
            );
          }

          // Render title straightly if not requested from TreeTable
          return <Typography variant="body2">{row.title}</Typography>;
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

const SimpleTable: React.FC<TableProps> = ({
  rows,
  columns,
  onEdit,
  onDelete,
  loading,
}) => {
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
      hideFooter
      checkboxSelection
      disableRowSelectionOnClick
      getRowId={(row) => row.id}
      loading={loading}
    />
  );
};

export default SimpleTable;
