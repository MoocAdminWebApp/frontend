import * as React from "react";
import {
  Box,
  Button,
  TextField,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import {
  GridColDef,
  GridPaginationModel,
} from "@mui/x-data-grid";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import SearchIcon from "@mui/icons-material/Search";
import toast from "react-hot-toast";

import { get, post, put, del } from "../../request/axios";
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
  const [filter, setFilter] = React.useState<FilterPagedResultRequestDto>({
    page: 1,
    pageSize: 10,
  });
  const [pagedResult, setPagedResult] = React.useState<PagedResultDto<RoleDto>>({
    items: [],
    total: 0,
  });

  const searchQuery = useDebounce(searchText, 500);

  React.useEffect(() => {
    setFilter((prev) => ({ ...prev, filter: searchQuery }));
  }, [searchQuery]);

  React.useEffect(() => {
    const load = async () => {
      setLoading(true);
      const resp = await get<PagedResultDto<RoleDto>>(
        `/roles/page`,
        {
          page: filter.page,
          pageSize: filter.pageSize,
          filters: filter.filter ? JSON.stringify({ roleName: filter.filter }) : undefined,
          fuzzyKeys: "roleName",
        }
      );
      if (resp.isSuccess && resp.data) {
        setPagedResult(resp.data);
      } else {
        toast.error(resp.message || "Failed to load roles");
      }
      setLoading(false);
    };
    load();
  }, [filter]);

  const handlePaginationChange = (model: GridPaginationModel) => {
    setFilter((prev) => ({
      ...prev,
      page: model.page + 1,
      pageSize: model.pageSize,
    }));
  };

  const handleSave = async (role: CreateRoleDto | UpdateRoleDto | null) => {
    if (!role) return;
    let resp;
    if (role.id && role.id > 0) {
      resp = await put(`/roles/${role.id}`, role);
    } else {
      resp = await post("/roles", role);
    }
    if (resp.isSuccess) {
      toast.success(role.id ? "Updated successfully" : "Created successfully");
      setFilter((prev) => ({ ...prev, page: 1 })); // reload first page
      setOpenDialog(false);
    } else {
      toast.error(resp.message || "Operation failed");
    }
  };

  const handleEdit = async (row: RoleDto) => {
    const resp = await get<RoleDto>(`/roles/${row.id}`);
    if (resp.isSuccess && resp.data) {
      setCurrentRole(resp.data);
      setOpenDialog(true);
    } else {
      toast.error(resp.message || "Failed to load role");
    }
  };

  const handleDelete = async () => {
    const resp = await del(`/roles/${deleteId}`);
    if (resp.isSuccess) {
      toast.success("Deleted successfully");
      setFilter((prev) => ({ ...prev, page: 1 }));
    } else {
      toast.error(resp.message || "Delete failed");
    }
    setConfirmOpen(false);
  };

  const columns: GridColDef[] = [
    { field: "roleName", headerName: "Role Name", flex: 1 },
    { field: "description", headerName: "Description", flex: 1 },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      renderCell: ({ value }) =>
        value ? (
          <Stack direction="row" alignItems="center" spacing={1}>
            <CheckCircleIcon color="success" fontSize="small" />
            <Typography variant="body2">Active</Typography>
          </Stack>
        ) : (
          <Stack direction="row" alignItems="center" spacing={1}>
            <CancelIcon color="error" fontSize="small" />
            <Typography variant="body2">Inactive</Typography>
          </Stack>
        ),
    },
    { field: "createdBy", headerName: "Created By", flex: 1 },
    { field: "updatedBy", headerName: "Updated By", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: ({ row }) => (
        <Box>
          <IconButton onClick={() => handleEdit(row)}>
            <EditIcon />
          </IconButton>
          <IconButton
            onClick={() => {
              setDeleteId(row.id);
              setConfirmOpen(true);
            }}
          >
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
          onClick={() => {
            setCurrentRole(null);
            setOpenDialog(true);
          }}
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
        title="Confirm Delete"
        content="Are you sure you want to delete this role?"
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </Box>
  );
};

export default Role;
