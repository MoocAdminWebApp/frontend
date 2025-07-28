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
import MenuList from "./menuList";
import {
  FilmOptionType,
  FilterPagedResultRequestDto,
  ListResultDto,
  PagedResultDto,
} from "../../types/types";
import { del, get, post, put } from "../../request/axios/index";
import PageLoading from "../../components/PageLoading";
import OperateConfirmationDialog from "../../components/OperateConfirmationDialog";
import useDebounce from "../../hooks/useDebounce";
import PermissionControl from "../../components/PermissionControl";
import AddUpdateDialog from "./addUpdateDialog";

import { CreateMenuDto, MenuDto, UpdateMenuDto } from "../../types/menu";
import { ColumnType, CustomColumn } from "../../components/tables/SimpleTable";
import PaginatedTable from "../../components/tables/PaginatedTable";

const Menu: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentMenu, setCurrentMenu] = useState<UpdateMenuDto | null>(null);
  const [searchText, setSearchText] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("");

  const searchQuery = useDebounce(searchText, 500); //use Debounce Hook
  useEffect(() => {
    setFilterPagedResultRequest((pre) => ({ ...pre, filter: searchQuery }));
  }, [searchQuery]);

  /**
   * open Dialog
   * @param user
   */
  const handleOpenDialog = (menu: UpdateMenuDto | null) => {
    setCurrentMenu(menu);
    setOpenDialog(true);
  };

  /**
   * Close Dialog
   */
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentMenu(null);
  };

  /**
   * Save menu (add or modify)
   * @param menu
   */
  const handleSaveMenu = async (menu: CreateMenuDto | UpdateMenuDto | null) => {
    if (menu) {
      if (menu.id > 0) {
        let resp = await put<boolean>("/menus", menu);
        if (resp.isSuccess) {
          toast.success("update success");
          setFilterPagedResultRequest((pre) => ({ ...pre, page: 1 }));
          handleCloseDialog();
        } else {
          toast.error(resp.message);
        }
      } else {
        let resp = await post<boolean>("/menus", menu);
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
  const [pageData, setPageData] = useState<PagedResultDto<MenuDto>>({
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
        let resp = await get<PagedResultDto<MenuDto>>(
          // `/menus/${filterPagedResultRequestDto.page}/${filterPagedResultRequestDto.pageSize}?title=${filterPagedResultRequestDto.filter}` // TODO: fix this line
          `/menus?page=${filterPagedResultRequest.page}&pageSize=${
            filterPagedResultRequest.pageSize
          }&filter=${filterPagedResultRequest.filter ?? ""}`
        );

        if (resp.isSuccess) {
          console.log("getPageData new items:", resp.data.items);
          console.log("getPageData", resp.data.total);
          setPageData(resp.data);
        }
      } finally {
        setLoading(false);
      }
    };
    getPageData();
  }, [filterPagedResultRequest]);

  const columns: CustomColumn[] = [
    { field: "title", headerName: "Title", type: "text", width: 300 },
    { field: "status", headerName: "Status", type: "chip", width: 150 },
    { field: "type", headerName: "Type", type: "chip", width: 120 },
    {
      field: "permissionInfo",
      headerName: "Permission",
      type: "text",
      width: 180,
    },
    { field: "createdAt", headerName: "Created At", type: "text", width: 150 },
    { field: "actions", headerName: "Actions", type: "action", width: 100 },
  ];

  const handleUpdate = async (menu: MenuDto | null) => {
    let resp = await get<MenuDto>(`menus/${menu?.id}`);
    if (resp.isSuccess) {
      let menuDetail = resp.data;
      let updateMenuDto: UpdateMenuDto = {
        id: menuDetail.id,
        title: menuDetail.title,
        menuType: menuDetail.menuType,
        parentId: menuDetail.parentId,
        orderNum: menuDetail.orderNum,
        route: menuDetail.route,
        componentPath: menuDetail.componentPath,
        permission: menuDetail.permission,
        status: menuDetail.status,
        comment: menuDetail.comment,
      };
      handleOpenDialog(updateMenuDto);
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
    let resp = await del<boolean>(`menus/${deData}`);
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
    <Box sx={{ height: "100%", width: "95%", margin: "0 auto" }}>
      <h2>Menu Management</h2>
      <Box sx={{ height: 700, width: "100%", p: 3 }}>
        {/* Load animation components */}
        {/* <PageLoading
                loading={loading}
                size={50}
                color="primary"
                message="Loading menus, please wait..."
            /> */}
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <TextField
            variant="outlined"
            placeholder="Search menus..."
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
            Add Menu
          </Button>
        </Box>

        <PaginatedTable
          columns={columns}
          rows={pageData.items ?? []}
          totalCount={pageData.total}
          loading={loading}
          paginationModel={{
            page: filterPagedResultRequest.page - 1,
            pageSize: filterPagedResultRequest.pageSize,
          }}
          onPaginationModelChange={(newModel) => {
            setFilterPagedResultRequest((prev) => ({
              ...prev,
              page: newModel.page + 1,
              pageSize: newModel.pageSize,
            }));
          }}
          onEdit={handleUpdate}
          onDelete={(row) => handleDelete(row.id)}
        />

        <AddUpdateDialog
          open={openDialog}
          onClose={handleCloseDialog as () => void}
          menu={currentMenu}
          onSave={
            handleSaveMenu as (
              menu: CreateMenuDto | UpdateMenuDto | null
            ) => Promise<void>
          }
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
    </Box>
  );
};

export default Menu;
