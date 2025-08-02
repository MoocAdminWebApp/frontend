import * as React from "react";
import {
  Box,
  Button,
  TextField,
  IconButton,
} from "@mui/material";
import {
  GridColDef,
  GridPaginationModel,
} from "@mui/x-data-grid";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import toast from "react-hot-toast";

import { get, post, put, del } from "../../request/axios";
import useDebounce from "../../hooks/useDebounce";
import PermissionList from "./PermissionList";
import AddUpdatePermissionDialog from "./addUpdateDialog";
import OperateConfirmationDialog from "../../components/OperateConfirmationDialog";
import {
  PermissionDto,
  CreatePermissionDto,
  UpdatePermissionDto,
} from "../../types/permission";
import {
  FilterPagedResultRequestDto,
  PagedResultDto,
} from "../../types/types";
import { formatDateValue } from "../../utils/formatDate";
import UserNameCell from "../../components/UserNameCell";
import GetAndStoreRolePermissions from "../../utils/UserAllPermissions";
import { getStoredPermissions } from "../../utils/GetStoredPermissions";

import { hasPermission } from "../../utils/HasPermission";

//testing
// a valid roleId needs to be provided as a parameter after login
const roleId = 3;
const rolePermissions = getStoredPermissions(roleId);

//store permissions of the role 
//has to be run after login with a valid roleId

// GetAndStoreRolePermissions(roleId);

// optional
// const pagePermissions = ["permission:viewall","permission:add","permission:update","permission:delete"];
// console.log(getStoredPermissions());


const isUpdateDto = (
  dto: CreatePermissionDto | UpdatePermissionDto | null
): dto is UpdatePermissionDto =>
  dto !== null &&
  "id" in dto &&
  typeof dto.id === "number" &&
  dto.id > 0;

const Permission: React.FC = () => {
  const [loading, setLoading] = React.useState(false);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [currentItem, setCurrentItem] =
    React.useState<UpdatePermissionDto | null>(null);
  const [searchText, setSearchText] = React.useState("");
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [deleteId, setDeleteId] = React.useState<number>(0);
  const [filter, setFilter] = React.useState<FilterPagedResultRequestDto>({
    page: 1,
    pageSize: 10,
  });
  const [pagedResult, setPagedResult] =
    React.useState<PagedResultDto<PermissionDto>>({
      items: [],
      total: 0,
    });

  const searchQuery = useDebounce(searchText, 500);

  React.useEffect(() => {
    setFilter((prev) => ({ ...prev, filter: searchQuery }));
  }, [searchQuery]);

  const load = async () => {
      setLoading(true);
      const resp = await get<PagedResultDto<PermissionDto>>(
        `/permissions/page`,
        {
          page: filter.page,
          pageSize: filter.pageSize,
          fuzzyKeys: "permissionName,description",
          filter: searchQuery ?? "",
        }
      );
      if (resp.isSuccess && resp.data) {
        setPagedResult(resp.data);
      }
      setLoading(false);
    };

  React.useEffect(() => {
    
    load();
  }, [filter]);

  const handlePaginationChange = (model: GridPaginationModel) => {
    setFilter((prev) => ({
      ...prev,
      page: model.page + 1,
      pageSize: model.pageSize,
    }));
  };

  const handleSave = async (
    data: CreatePermissionDto | UpdatePermissionDto | null
  ) => {
    if (!data) return;

    const resp = isUpdateDto(data)
      ? await put(`/permissions/${data.id}`, data)
      : await post("/permissions", data);

    if (resp.isSuccess) {
      toast.success(
        isUpdateDto(data) ? "Updated successfully" : "Created successfully"
      );
      setFilter((prev) => ({ ...prev, page: 1 }));
      setOpenDialog(false);
    } else {
      toast.error(resp.message);
    }
  };

  const handleEdit = async (row: PermissionDto) => {
    const resp = await get<PermissionDto>(
      `/permissions/${row.id}`
    );
    if (resp.isSuccess) {
      setCurrentItem(resp.data);
      setOpenDialog(true);
    } else {
      toast.error(resp.message);
    }
  };

  const handleDelete = async () => {
    const resp = await del(`/permissions/${deleteId}`);
    if (resp.isSuccess) {
      toast.success("Deleted successfully");
      await load();
      // setFilter((prev) => ({ ...prev, page: 1 }));
    } else {
      toast.error(resp.message);
    }
    setConfirmOpen(false);
  };

  const columns: GridColDef[] = [
    { field: "permissionName", headerName: "Permission Name", flex: 1 },
    { field: "description", headerName: "Description", flex: 1 },
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
          {/*when role id =3,  viewall display button*/}
        {hasPermission("permission:viewall",rolePermissions) && (
        <IconButton onClick={() => handleEdit(row)}>
          <EditIcon />
        </IconButton>
      )}
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
          placeholder="Search permissions..."
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
            setCurrentItem(null);
            setOpenDialog(true);
          }}
        >
          Add Permission
        </Button>
      </Box>

      <PermissionList
        loading={loading}
        columns={columns}
        pagedResult={pagedResult}
        page={filter.page - 1}
        pageSize={filter.pageSize}
        onPaginationModelChange={handlePaginationChange}
      />

      <AddUpdatePermissionDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        data={currentItem}
        onSave={handleSave}
      />

      <OperateConfirmationDialog
        open={confirmOpen}
        title="Confirm Delete"
        content="Are you sure you want to delete this permission?"
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
      />


    </Box>

    
  );
};

export default Permission;
