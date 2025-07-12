import * as React from "react";
import { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Tooltip,
  Stack,
  Typography,
  Switch,
  FormControlLabel,
} from "@mui/material";

import { GridColDef, GridPaginationModel, GridRowId } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

import toast from "react-hot-toast";
import UserList from "./UserList";

import {
  FilmOptionType,
  FilterPagedResultRequestDto,
  ListResultDto,
  PagedResultDto,
} from "../../types/types";
import { del, get, post, put } from "../../request/axios/index";
import { Gender } from "../../types/enum";
import { Formik } from "formik";
import { CreateUserDto, UserDto, UpdateUserDto } from "../../types/user";
import PageLoading from "../../components/PageLoading";
import OperateConfirmationDialog from "../../components/OperateConfirmationDialog";
import useDebounce from "../../hooks/useDebounce";
import PermissionControl from "../../components/PermissionControl";
import AddUpdateDialog from "./addUpdateDialog";

const User: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentUser, setCurrentUser] = useState<UpdateUserDto | null>(null);
  const [searchText, setSearchText] = useState("");

  const searchQuery = useDebounce(searchText, 500); //use Debounce Hook
  useEffect(() => {
    setFilterPagedResultRequest((pre) => ({ ...pre, filter: searchQuery }));
  }, [searchQuery]);

  /**
   * open Dialog
   * @param user
   */
  const handleOpenDialog = (user: UpdateUserDto | null) => {
    setCurrentUser(user);
    setOpenDialog(true);
  };

  /**
   * Close Dialog
   */
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentUser(null);
  };

  /**
   * Save user (add or modify)
   * @param user
   */
  const handleSaveUser = async (user: CreateUserDto | UpdateUserDto | null) => {
    if (user) {
      if (user.id > 0) {
        let resp = await put<boolean>("/users", user);
        if (resp.isSuccess) {
          toast.success("update success");
          setFilterPagedResultRequest((pre) => ({ ...pre, page: 1 }));
          handleCloseDialog();
        } else {
          toast.error(resp.message);
        }
      } else {
        let resp = await post<boolean>("/users", user);
        if (resp.isSuccess) {
          toast.success("add success");
          setFilterPagedResultRequest((pre) => ({ ...pre, page: 1 }));
          handleCloseDialog();
        } else {
          toast.error(resp.message);
        }
      }
    }
  };

  const [filterPagedResultRequest, setFilterPagedResultRequest] =
    useState<FilterPagedResultRequestDto>({ page: 1, pageSize: 10 });
  const [pageData, setPageData] = useState<PagedResultDto<UserDto>>({
    items: [],
    total: 0,
  });

  useEffect(() => {
    let getPageData = async () => {
      setLoading(true);
      try {
        let filterPagedResultRequestDto: FilterPagedResultRequestDto = {
          ...filterPagedResultRequest,
        };
        let resp = await get<PagedResultDto<UserDto>>(
          `/users/${filterPagedResultRequestDto.page}/${filterPagedResultRequestDto.pageSize}?title=${filterPagedResultRequestDto.filter}`
        );
        if (resp.isSuccess) {
          setPageData(resp.data);
        }
      } finally {
        setLoading(false);
      }
    };
    getPageData();
  }, [filterPagedResultRequest]);

  //Table Column Definition
  const columns: GridColDef[] = [
    { field: "id", headerName: "Id", width: 80 },
    { field: "email", headerName: "Email", width: 240 },
    { field: "firstName", headerName: "First Name", width: 180 },
    { field: "lastName", headerName: "Last Name", width: 180 },
    { field: "access", headerName: "Access", width: 120 },
    {
      field: "active",
      headerName: "Active",
      width: 120,
      renderCell: (params) => {
        return (
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
            {params.value ? (
              <Tooltip title="Acitve">
                <CheckCircleIcon color="success" fontSize="small" />
              </Tooltip>
            ) : (
              <Tooltip title="not active">
                <CancelIcon color="error" fontSize="small" />
              </Tooltip>
            )}
            <Typography variant="body2">
              {params.value ? "Acitve" : "not active"}
            </Typography>
          </Stack>
        );
      },
    },
    {
      field: "createAt",
      headerName: "CreateAt",
      width: 180,
      valueFormatter: (value) => {
        if (!value) return "-";
        return new Date(value).toLocaleString();
      },
    },
    {
      field: "updateAt",
      headerName: "UpdateAt",
      width: 180,
      valueFormatter: (value) => {
        if (!value) return "-";
        return new Date(value).toLocaleString();
      },
    },
    { field: "createBy", headerName: "CreateBy", width: 100 },
    { field: "updateBy", headerName: "UpdateBy", width: 100 },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <Box>
          <PermissionControl permission="">
            <IconButton onClick={() => handleUpdate(params.row as UserDto)}>
              <EditIcon />
            </IconButton>
          </PermissionControl>
          <PermissionControl permission="">
            <IconButton onClick={() => handleDelete(params.id)}>
              <DeleteIcon />
            </IconButton>
          </PermissionControl>
        </Box>
      ),
    },
  ];

  const handleUpdate = async (user: UserDto | null) => {
    let resp = await get<UserDto>(`users/${user?.id}`);
    if (resp.isSuccess) {
      let userDetail = resp.data;
      let updateUserDto: UpdateUserDto = {
        id: userDetail.id,
        email: userDetail.email,
        firstName: userDetail.firstName,
        lastName: userDetail.lastName,
        access: userDetail.access,
        active: userDetail.active,
        // createAt: new Date(userDetail.createAt),
        // updateAt: new Date(userDetail.updateAt),
        // createBy: userDetail.createBy,
        // updateBy: userDetail.updateBy,
      };
      handleOpenDialog(updateUserDto);
    } else {
      toast.error(resp.message);
    }
  };

  const [comfirmDialogOpen, setComfirmDialogOpen] = useState(false);
  const [deData, setDelData] = useState(0);
  const handleDelete = async (id: GridRowId) => {
    setDelData(id as number);
    setComfirmDialogOpen(true);
  };

  const handleComfirmDelete = async () => {
    let resp = await del<boolean>(`users/${deData}`);
    if (resp.isSuccess) {
      setFilterPagedResultRequest((pre) => ({ ...pre, page: 1 }));
      toast.success("delete success");
    } else {
      toast.error(resp.message);
    }
    setComfirmDialogOpen(false);
    console.log("handleComfirmDelete", deData);
  };

  const handleComfirmCancel = () => {
    setComfirmDialogOpen(false);
  };

  const onPaginationModelChange = (newModel: GridPaginationModel) => {
    setFilterPagedResultRequest((preState) => {
      return {
        ...preState,
        page: newModel.page + 1,
        pageSize: newModel.pageSize,
      };
    });
  };

  return (
    <Box sx={{ height: 500, width: "100%", p: 3 }}>
      {/* Load animation components */}
      {/* <PageLoading
                loading={loading}
                size={50}
                color="primary"
                message="Loading users, please wait..."
            /> */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <TextField
          variant="outlined"
          placeholder="Search users..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          InputProps={{
            startAdornment: (
              <SearchIcon sx={{ color: "action.active", mr: 1 }} />
            ),
          }}
          sx={{ width: 300 }}
        />

        <Button
          disabled={loading}
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog(null)}
        >
          Add User
        </Button>
      </Box>
      <UserList
        loading={loading}
        columns={columns}
        pagedResult={pageData}
        page={filterPagedResultRequest.page - 1}
        pageSize={filterPagedResultRequest.pageSize}
        onPaginationModelChange={onPaginationModelChange}
      />

      <AddUpdateDialog
        open={openDialog}
        onClose={handleCloseDialog}
        user={currentUser}
        onSave={handleSaveUser}
        //errors={errors}
        //roles={roles}
      />

      <OperateConfirmationDialog
        open={comfirmDialogOpen}
        title="confirm delete"
        content="Are you sure you want to delete this item? This operation is irrevocable."
        onConfirm={handleComfirmDelete}
        onCancel={handleComfirmCancel}
      />
    </Box>
  );
};

export default User;
