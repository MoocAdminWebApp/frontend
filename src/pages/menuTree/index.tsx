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

import toast from "react-hot-toast";
import MenuList from "./menuList";
import {
  FilmOptionType,
  ListResultDto,
  FilterResultRequestDto,
} from "../../types/types";
import { del, get, post, put } from "../../request/axios/index";
import { CreateMenuDto, MenuDto, UpdateMenuDto } from "../../types/menu";
import PageLoading from "../../components/PageLoading";
import OperateConfirmationDialog from "../../components/OperateConfirmationDialog";
import useDebounce from "../../hooks/useDebounce";
import PermissionControl from "../../components/PermissionControl";
import AddUpdateDialog from "./addUpdateDialog";

import SimpleTable, {
  ColumnType,
  CustomColumn,
} from "../../components/tables/SimpleTable";
import { TreeViewBaseItem } from "@mui/x-tree-view";
import { RichTreeView } from "@mui/x-tree-view";
// import TreeViewTable from "../../components/tables/TreeViewTable";
import TreeTableMUI, { TreeNode } from "../../components/tables/TreeViewTable";
import {
  // toTreeViewItem,
  convertFlatToTree,
  buildTreeFromFlatData,
  flattenTree,
} from "../../utils/treeStructureUtil";

import TreeTable from "../../components/tables/TreeTable";

const MenuTree: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentMenu, setCurrentMenu] = useState<UpdateMenuDto | null>(null);
  const [searchText, setSearchText] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("");

  const searchQuery = useDebounce(searchText, 500); //use Debounce Hook
  useEffect(() => {
    setFilterResultRequest((pre) => ({ ...pre, filter: searchQuery }));
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
          setFilterResultRequest((pre) => ({ ...pre, page: 1 }));
          handleCloseDialog();
        } else {
          toast.error(resp.message);
        }
      } else {
        let resp = await post<boolean>("/menus", menu);
        if (resp.isSuccess) {
          toast.success("add success");
          setFilterResultRequest((pre) => ({ ...pre, page: 1 }));
          handleCloseDialog();
        } else {
          toast.error(resp.message);
        }
      }
    }
  };

  // Remove Pagination
  const [filterResultRequest, setFilterResultRequest] =
    useState<FilterResultRequestDto>({
      sort: "",
      filter: "",
    });
  const [dispData, setDispData] = useState<TreeNode[]>([]);

  useEffect(() => {
    let getRawData = async () => {
      setLoading(true);
      try {
        let filterResultRequestDto: FilterResultRequestDto = {
          ...filterResultRequest,
        };
        let resp = await get<ListResultDto<MenuDto>>(
          `/menus/tree?filter=${filterResultRequest.filter ?? ""}`
        );

        if (resp.isSuccess) {
          console.log("getPageData new items:", resp.data.items);
          // const { items: treeData, expandables: expandableIds } =
          //   convertFlatToTree(resp.data.items);
          // console.log("treeData", treeData);
          // const treeItems = treeData.map(toTreeViewItem);
          setDispData(resp.data.items);
          // const treeData = buildTreeFromFlatData()
        }
      } finally {
        setLoading(false);
      }
    };
    getRawData();
  }, [filterResultRequest]);

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
      setFilterResultRequest((pre) => ({ ...pre, page: 1 }));
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

        <TreeTable rows={dispData} columns={columns} />

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

export default MenuTree;
