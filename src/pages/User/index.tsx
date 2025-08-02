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
import PageviewIcon from "@mui/icons-material/Pageview";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import SearchIcon from "@mui/icons-material/Search";
import toast from "react-hot-toast";

import { get, post, put, del } from "../../request/axios";
import useDebounce from "../../hooks/useDebounce";
import UserList from "./UserList";
import AddUpdateDialog from "./addUpdateDialog";
import ProfileDialog from "./profileDialog";
import OperateConfirmationDialog from "../../components/OperateConfirmationDialog";
import { UserDto, CreateUserDto, UpdateUserDto } from "../../types/user";
import {
  ProfileDto,
  CreateProfileDto,
  UpdateProfileDto,
} from "../../types/profile";
import { FilterPagedResultRequestDto, PagedResultDto } from "../../types/types";
import { formatDateValue } from "../../utils/formatDate";
import UserNameCell from "../../components/UserNameCell";
import { RoleDto } from "../../types/role";

const User: React.FC = () => {
  const [roles, setRoles] = React.useState<RoleDto[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [openProfileDialog, setOpenProfileDialog] = React.useState(false);
  const [currentUser, setCurrentUser] = React.useState<UpdateUserDto | null>(
    null
  );
  const [currentProfile, setCurrentProfile] =
    React.useState<UpdateProfileDto | null>(null);
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

  // load roles from backend
  const loadRoles = async () => {
    const resp = await get<RoleDto[]>("/roles");
    if (resp.isSuccess && resp.data) {
      setRoles(resp.data);
    } else {
      toast.error(resp.message || "Failed to load roles");
    }
  };

  // load roles
  React.useEffect(() => {
    loadRoles();
  }, []);

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
    if (user.id && user.id > 0) {
      const { email, ...userWithoutEmail } = user;
      resp = await put(`/users/${user.id}`, userWithoutEmail);
    } else {
      resp = await post("/users", user);
    }
    if (resp.isSuccess) {
      toast.success(user.id ? "Updated successfully" : "Created successfully");
      setFilter((prev) => ({ ...prev, page: 1 })); // reload first page
      setOpenDialog(false);
    } else {
      toast.error(resp.message || "Operation failed");
    }
  };

  const handleProfileSave = async (
    profile: CreateProfileDto | UpdateProfileDto | null
  ) => {
    if (!profile) return;

    let resp;
    //for update, profile.id >0
    if (profile.id && profile.id > 0) {
      resp = await put(`/profiles/${profile.id}`, profile);
    } else {
      // add userId to profile
      const profileWithUserId = { ...profile };
      resp = await post("/profiles", profileWithUserId);
    }

    if (resp.isSuccess) {
      toast.success(
        profile.id ? "Updated successfully" : "Created successfully"
      );
      setFilter((prev) => ({ ...prev, page: 1 }));
      setOpenProfileDialog(false);
    } else {
      toast.error(resp.message || "Operation failed");
    }
  };

  const handleEdit = async (row: UserDto) => {
    const resp = await get<UserDto>(`/users/${row.id}`);
    if (resp.isSuccess && resp.data) {
      // Convert the roles object array returned by the backend into a roleIds array
      const userWithRoleIds = {
        ...resp.data,
        roleIds: resp.data.roles ? resp.data.roles.map((role) => role.id) : [],
      };
      setCurrentUser(userWithRoleIds);
      setOpenDialog(true);
    } else {
      toast.error(resp.message || "Failed to load user");
    }
  };

  const handleProfile = async (row: ProfileDto) => {
    const resp = await get<ProfileDto>(`/profiles/by-user/${row.id}`);
    if (resp.isSuccess && resp.data) {
      setCurrentProfile(resp.data);
      setOpenProfileDialog(true);
    } else {
      // setCurrentProfile(null);
      // setOpenProfileDialog(true);
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
    { field: "email", headerName: "Email", width: 160 },
    { field: "firstName", headerName: "First Name", width: 120 },
    { field: "lastName", headerName: "Last Name", width: 120 },
    { field: "access", headerName: "Access", width: 100 },
    {
      field: "active",
      headerName: "Active",
      width: 100,
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
    {
      field: "roles",
      headerName: "Roles",
      width: 200,
      renderCell: ({ row }) => (
        <Typography variant="body2">
          {row.roles?.map((role: RoleDto) => role.roleName).join(", ") ||
            "No roles"}
        </Typography>
      ),
    },
    {
      field: "createdBy",
      headerName: "Created By",
      width: 120,
      renderCell: ({ row }) => <UserNameCell user={row.creator} />,
    },
    {
      field: "updatedBy",
      headerName: "Updated By",
      width: 120,
      renderCell: ({ row }) => <UserNameCell user={row.updater} />,
    },
    {
      field: "createdAt",
      headerName: "CreatedAt",
      width: 160,
      valueFormatter: formatDateValue,
    },
    {
      field: "updatedAt",
      headerName: "UpdatedAt",
      width: 160,
      valueFormatter: formatDateValue,
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
          <IconButton onClick={() => handleProfile(row)}>
            <PageviewIcon />
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
        roles={roles}
      />

      <ProfileDialog
        open={openProfileDialog}
        onClose={() => setOpenProfileDialog(false)}
        profile={currentProfile}
        onSave={(profile) => handleProfileSave(profile)}
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
