import * as React from "react";
import {
  Box,
  Button,
  TextField,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  GridColDef,
  GridPaginationModel,
  GridRowId,
} from "@mui/x-data-grid";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import SearchIcon from "@mui/icons-material/Search";
import toast from "react-hot-toast";

import { del, get, post, put } from "../../request/axios";
import useDebounce from "../../hooks/useDebounce";
import RoleList from "./RoleList";
import AddUpdateRoleDialog from "./AddUpdateRoleDialog";
import OperateConfirmationDialog from "../../components/OperateConfirmationDialog";
import { RoleDto, CreateRoleDto, UpdateRoleDto } from "../../types/role";
import { FilterPagedResultRequestDto, PagedResultDto } from "../../types/types";

const Role: React.FC = () => {
  const [loading, setLoading] = React.useState(false);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [currentRole, setCurrentRole] = React.useState<UpdateRoleDto | null>(null);
  const [searchText, setSearchText] = React.useState("");
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [deleteId, setDeleteId] = React.useState<number>(0);
  const [filter, setFilter] = React.useState<FilterPagedResultRequestDto>({ page: 1, pageSize: 10 });
  const [pagedResult, setPagedResult] = React.useState<PagedResultDto<RoleDto>>({ items: [], total: 0 });

  const searchQuery = useDebounce(searchText, 500);
  React.useEffect(() => {
    setFilter((prev) => ({ ...prev, filter: searchQuery }));
  }, [searchQuery]);

  React.useEffect(() => {
    const load = async () => {
      setLoading(true);
      const resp = await get<PagedResultDto<RoleDto>>(`/roles/${filter.page}/${filter.pageSize}?filter=${filter.filter ?? ""}`);
      if (resp.isSuccess) {
        setPagedResult(resp.data);
      }
      setLoading(false);
    };
    load();
  }, [filter]);

  const handlePaginationChange = (model: GridPaginationModel) => {
    setFilter((prev) => ({ ...prev, page: model.page + 1, pageSize: model.pageSize }));
  };

  const handleSave = async (role: CreateRoleDto | UpdateRoleDto | null) => {
    if (!role) return;
    const resp = role.id > 0
      ? await put("/roles", role)
      : await post("/roles", role);

    if (resp.isSuccess) {
      const isUpdate = !!role?.id && role.id > 0;
      toast.success(`${isUpdate ? "Updated" : "Added"} successfully`);
      setFilter((prev) => ({ ...prev, page: 1 }));
      setOpenDialog(false);
    } else {
      toast.error(resp.message);
    }
  };

  const handleEdit = async (row: RoleDto) => {
    const resp = await get<RoleDto>(`/roles/${row.id}`);
    if (resp.isSuccess) {
      const data = resp.data;
      setCurrentRole({ ...data });
      setOpenDialog(true);
    }
  };

  const handleDelete = async () => {
    const resp = await del(`/roles/${deleteId}`);
    if (resp.isSuccess) {
      toast.success("Deleted");
      setFilter((prev) => ({ ...prev, page: 1 }));
    } else {
      toast.error(resp.message);
    }
    setConfirmOpen(false);
  };

  const columns: GridColDef[] = [
    { field: "name", headerName: "Role Name", flex: 1 },
    { field: "description", headerName: "Description", flex: 1 },
    { field: "status", headerName: "Status", flex: 1 },
    { field: "createdBy", headerName: "CreatedBy", flex: 1 },
    { field: "updatedBy", headerName: "UpdatedBy", flex: 1 },
    {
      field: "active",
      headerName: "Active",
      width: 120,
      renderCell: ({ value }) => (
        <Stack direction="row" alignItems="center" spacing={1}>
          {value ? (
            <CheckCircleIcon color="success" fontSize="small" />
          ) : (
            <CancelIcon color="error" fontSize="small" />
          )}
          <Typography variant="body2">{value ? "Active" : "Inactive"}</Typography>
        </Stack>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: ({ row }) => (
        <Box>
          <IconButton onClick={() => handleEdit(row)}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => { setDeleteId(row.id); setConfirmOpen(true); }}>
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <TextField
          variant="outlined"
          placeholder="Search roles..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          InputProps={{
            startAdornment: <SearchIcon sx={{ mr: 1 }} />,
          }}
          sx={{ width: 300 }}
        />
        <Button
          startIcon={<AddIcon />}
          variant="contained"
          onClick={() => { setCurrentRole(null); setOpenDialog(true); }}
        >
          Add Role
        </Button>
      </Box>

      <RoleList
        loading={loading}
        columns={columns}
        pagedResult={pagedResult}
        page={filter.page - 1}
        pageSize={filter.pageSize}
        onPaginationModelChange={handlePaginationChange}
      />

      <AddUpdateRoleDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        role={currentRole}
        onSave={handleSave}
      />

      <OperateConfirmationDialog
        open={confirmOpen}
        title="Confirm delete"
        content="Are you sure you want to delete this role?"
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </Box>
  );
};

export default Role;
