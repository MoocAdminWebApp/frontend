// src/components/dialog/BaseDialog.tsx

import React, { useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Typography, Chip, IconButton, Box } from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import { Gender, EAccessType, StatusType, MenuType } from "../../types/enum";

// Dropdown components
