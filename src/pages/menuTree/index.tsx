import * as React from "react";
import { useEffect, useRef, useState, useMemo } from "react";
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

import { GridColDef, GridRowId } from "@mui/x-data-grid";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";

import toast from "react-hot-toast";
import MenuList from "./menuList";
import {
  FilmOptionType,
  ListResultDto,
  FilterResultRequestDto,
  TreeNode,
  FlatNode,
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
import {
  buildTreeFromFlatData,
  convertMenuDtoToTreeNode,
  flattenTreeWithExpand,
} from "../../utils/treeStructureUtil";

import TreeTable from "../../components/tables/TreeTable";
import { MenuType, StatusType, ExpandState } from "../../types/enum";

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

  /** Node expansion record (Expanded / Collapsed / NonExpandable) */
  const [expandMap, setExpandMap] = useState<Record<number, ExpandState>>({});
  // toggles expand state of a node with given id
  const handleToggleExpand = (id: number) => {
    setExpandMap((prev) => ({
      ...prev,
      [id]:
        prev[id] === ExpandState.Expanded
          ? ExpandState.Collapsed
          : ExpandState.Expanded,
    }));
  };

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

  // Filter and sort conditions
  const [filterResultRequest, setFilterResultRequest] =
    useState<FilterResultRequestDto>({
      sort: "",
      filter: "",
    });

  /**
   * @type MenuDto[] - Raw data returned from backend
   * @type TreeNode[] - Tree structure used to manage parent-child hierarchy
   * @type FlatNode[] - Flattened data used by frontend table for display; each node includes level, order, expandState, etc.
   *
   * Construct data that used to render frontend content following:
   * 1) Retrieve raw data (MenuDto[]) from backend
   * 2) Convert raw data into tree data (-->treeData: TreeNode[])
   * 3) Flatten tree data to obtain display data (-->dispData: FlatNode[])
   */
  const [treeData, setTreeData] = useState<TreeNode[]>([]); // Raw data in tree-structure (TreeNode[] type)
  // Calculates and obtains the data to display (i.e. expanded rows and their child nodes) using treeData and expandMap
  // Calculation will be triggered when the raw data is updated, or when there's change in expandMap
  const dispData = useMemo(
    () => flattenTreeWithExpand(treeData, null, 0, expandMap),
    [treeData, expandMap]
  );

  // Monitoring filterResultRequest and update display content
  useEffect(() => {
    const getRawData = async () => {
      const resp = await get<ListResultDto<MenuDto>>(
        `/menus/tree?filter=${filterResultRequest.filter ?? ""}`
      );
      if (resp.isSuccess) {
        const raw = convertMenuDtoToTreeNode(resp.data.items); // Convert the returned MenuDto[] into TreeNode[]
        const builtTree = buildTreeFromFlatData(raw); // Construct tree-structure
        setTreeData(builtTree); // Store as source data for further processing
      }
    };
    getRawData();
  }, [filterResultRequest]);

  // Initialize expandMap everytime there's change in treeData
  useEffect(() => {
    const initialExpandMap: Record<number, ExpandState> = {};

    function initExpandMap(nodes: TreeNode[]) {
      nodes.forEach((node) => {
        initialExpandMap[node.id] = node.children?.length
          ? ExpandState.Collapsed
          : ExpandState.NonExpandable;
        if (node.children?.length) initExpandMap(node.children);
      });
    }
    // Init expandMap only if treeData is not empty
    if (treeData.length) {
      initExpandMap(treeData);
      setExpandMap(initialExpandMap);
      console.log("expandMap ready:", initialExpandMap);
    }
  }, [treeData]);

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
  console.log("Tree data: ", treeData);

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

        <TreeTable
          rows={dispData}
          columns={columns}
          expandMap={expandMap}
          onToggleExpand={handleToggleExpand}
          onEdit={handleUpdate}
          onDelete={handleDelete}
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

export default MenuTree;
