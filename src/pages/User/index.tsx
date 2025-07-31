import * as React from "react";
import {
  Box,
  Button,
  TextField,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { GridColDef, GridPaginationModel } from "@mui/x-data-grid";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import SearchIcon from "@mui/icons-material/Search";
import toast from "react-hot-toast";

import { get, post, put, del } from "../../request/axios";
import useDebounce from "../../hooks/useDebounce";
import UserList from "./UserList";
import AddUpdateDialog from "./addUpdateDialog";
import OperateConfirmationDialog from "../../components/OperateConfirmationDialog";
import { UserDto, CreateUserDto, UpdateUserDto } from "../../types/user";
import { FilterPagedResultRequestDto, PagedResultDto } from "../../types/types";

const User: React.FC = () => {
  const [loading, setLoading] = React.useState(false);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [currentUser, setCurrentUser] = React.useState<UpdateUserDto | null>(
    null
  );
  const [searchText, setSearchText] = React.useState("");
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [deleteId, setDeleteId] = React.useState<number>(0);
  const [filter, setFilter] = React.useState<FilterPagedResultRequestDto>({
    page: 1,
    pageSize: 10,
  });
  const [pagedResult, setPagedResult] = React.useState<PagedResultDto<UserDto>>(
    {
      items: [],
      total: 0,
    }
  );

  const searchQuery = useDebounce(searchText, 500);

  React.useEffect(() => {
    setFilter((prev) => ({ ...prev, filter: searchQuery }));
  }, [searchQuery]);

  React.useEffect(() => {
    const load = async () => {
      setLoading(true);
      const resp = await get<PagedResultDto<UserDto>>(`/users/page`, {
        page: filter.page,
        pageSize: filter.pageSize,
        filters: filter.filter
          ? JSON.stringify({ email: filter.filter })
          : undefined,
        fuzzyKeys: "email",
      });
      if (resp.isSuccess && resp.data) {
        setPagedResult(resp.data);
      } else {
        toast.error(resp.message || "Failed to load users");
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

  const handleSave = async (user: CreateUserDto | UpdateUserDto | null) => {
    if (!user) return;
    let resp;
    console.log(user);
    if (user.id && user.id > 0) {
      const { email, ...userWithoutEmail } = user;
      resp = await put(`/users/${user.id}`, userWithoutEmail);
      console.log("update resp", resp);
    } else {
      resp = await post("/users", user);
    }
    console.log("success", resp.isSuccess);
    if (resp.isSuccess) {
      toast.success(user.id ? "Updated successfully" : "Created successfully");
      setFilter((prev) => ({ ...prev, page: 1 })); // reload first page
      setOpenDialog(false);
    } else {
      toast.error(resp.message || "Operation failed");
    }
  };

  const handleEdit = async (row: UserDto) => {
    const resp = await get<UserDto>(`/users/${row.id}`);
    if (resp.isSuccess && resp.data) {
      setCurrentUser(resp.data);
      setOpenDialog(true);
    } else {
      toast.error(resp.message || "Failed to load user");
    }
  };

  const handleDelete = async () => {
    const resp = await del(`/users/${deleteId}`);
    if (resp.isSuccess) {
      toast.success("Deleted successfully");
      setFilter((prev) => ({ ...prev, page: 1 }));
    } else {
      toast.error(resp.message || "Delete failed");
    }
    setConfirmOpen(false);
  };

  const columns: GridColDef[] = [
    { field: "email", headerName: "Email", width: 240 },
    { field: "firstName", headerName: "First Name", width: 180 },
    { field: "lastName", headerName: "Last Name", width: 180 },
    { field: "access", headerName: "Access", flex: 1 },
    {
      field: "active",
      headerName: "Active",
      flex: 1,
      renderCell: ({ value }) =>
        value ? (
          <Stack
            direction="row"
            alignItems="center"
            spacing={1}
            sx={{
              height: "100%",
              position: "relative",
              top: "50%",
              transform: "translateY(-50%)",
            }}
          >
            <CheckCircleIcon color="success" fontSize="small" />
            <Typography variant="body2">Active</Typography>
          </Stack>
        ) : (
          <Stack
            direction="row"
            alignItems="center"
            spacing={1}
            sx={{
              height: "100%",

              position: "relative",
              top: "50%",
              transform: "translateY(-50%)",
            }}
          >
            <CancelIcon color="error" fontSize="small" />
            <Typography variant="body2">Inactive</Typography>
          </Stack>
        ),
    },

    { field: "createdBy", headerName: "Created By", flex: 1 },
    { field: "updatedBy", headerName: "Updated By", flex: 1 },
    {
      field: "createdAt",
      headerName: "CreatedAt",
      width: 180,
      valueFormatter: (value) => {
        if (!value) return "-";
        return new Date(value).toLocaleString();
      },
    },
    {
      field: "updatedAt",
      headerName: "UpdatedAt",
      width: 180,
      valueFormatter: (value) => {
        if (!value) return "-";
        return new Date(value).toLocaleString();
      },
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
          placeholder="Search users..."
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
            setCurrentUser(null);
            setOpenDialog(true);
          }}
        >
          Add User
        </Button>
      </Box>

      <UserList
        loading={loading}
        columns={columns}
        pagedResult={pagedResult}
        page={filter.page - 1}
        pageSize={filter.pageSize}
        onPaginationModelChange={handlePaginationChange}
      />

      <AddUpdateDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        user={currentUser}
        onSave={handleSave}
      />

      <OperateConfirmationDialog
        open={confirmOpen}
        title="Confirm Delete"
        content="Are you sure you want to delete this user?"
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </Box>
  );
};

export default User;
