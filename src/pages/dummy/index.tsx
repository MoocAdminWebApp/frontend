import * as React from "react";
import { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  IconButton,
  TextField,
  Tooltip,
  Stack,
  Typography,
} from "@mui/material";

import { GridColDef, GridPaginationModel, GridRowId } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import VisibilityIcon from "@mui/icons-material/Visibility";

import toast from "react-hot-toast";
import DemoList from "./demoList";
import {
  FilmOptionType,
  FilterPagedResultRequestDto,
  ListResultDto,
  PagedResultDto,
} from "../../types/types";
import { del, get, post, put } from "../../request/axios/index";
import { Gender } from "../../types/enum";
import { Formik } from "formik";
import { CreateDemoDto, DemoDto, UpdateDemoDto } from "../../types/demo";
import PageLoading from "../../components/PageLoading";
import OperateConfirmationDialog from "../../components/OperateConfirmationDialog";
import useDebounce from "../../hooks/useDebounce";
import PermissionControl from "../../components/PermissionControl";
import AddUpdateDialog from "./addUpdateDialog";

// TODO: Copy and paste the following code block
// permission control imports
// import { useEffect, useRef, useState } from "react";
import { useActiveMenuIdFromRoute } from "../../hooks/useActiveMenuIdFromRoute";
import BtnPermissionControl from "../../components/permissionControl/BtnPermissionControl";
import PagePermissionControl from "../../components/permissionControl/PagePermissionControl";
import { usePagePrefixFromMenuId } from "../../hooks/usePagePrefixFromMenuId";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
// import PageLoading from "../../components/PageLoading";

// TODO: End of copy and paste

const Demos: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentDemo, setCurrentDemo] = useState<UpdateDemoDto | null>(null);
  const [searchText, setSearchText] = useState("");

  const [filterPagedResultRequest, setFilterPagedResultRequest] =
    useState<FilterPagedResultRequestDto>({ page: 1, pageSize: 10 });
  const [pageData, setPageData] = useState<PagedResultDto<DemoDto>>({
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
        let resp = await get<PagedResultDto<DemoDto>>(
          `/demos/${filterPagedResultRequestDto.page}/${filterPagedResultRequestDto.pageSize}?title=${filterPagedResultRequestDto.filter}`
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

  const searchQuery = useDebounce(searchText, 500); //use Debounce Hook
  useEffect(() => {
    setFilterPagedResultRequest((pre) => ({ ...pre, filter: searchQuery }));
  }, [searchQuery]);

  const [comfirmDialogOpen, setComfirmDialogOpen] = useState(false);
  const [deData, setDelData] = useState(0);
  const handleDelete = async (id: GridRowId) => {
    setDelData(id as number);
    setComfirmDialogOpen(true);
  };

  // TODO: Copy and paste the following code block
  // page permission control init
  const [currentPrefix, setCurrentPrefix] = useState<string | null>(null);
  const activeMenuId = useActiveMenuIdFromRoute();
  const { pagePrefix, loading: prefixLoading } =
    usePagePrefixFromMenuId(activeMenuId);
  const prefix = pagePrefix ? pagePrefix : "";

  const permissions = useSelector((state: RootState) => state.auth.permissions);
  const isPermissionLoaded = useSelector(
    (state: RootState) => state.auth.isPermissionLoaded
  );

  if (prefixLoading || !isPermissionLoaded) {
    return <PageLoading loading={true} message="Loading page..." />;
  }
  const hasPermission = (p: string) => permissions.includes(p);
  // TODO: End of copy and paste

  /**
   * open Dialog
   * @param user
   */
  const handleOpenDialog = (demo: UpdateDemoDto | null) => {
    setCurrentDemo(demo);
    setOpenDialog(true);
  };

  /**
   * Close Dialog
   */
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentDemo(null);
  };

  /**
   * Save demo (add or modify)
   * @param demo
   */
  const handleSaveDemo = async (demo: CreateDemoDto | UpdateDemoDto | null) => {
    if (demo) {
      if (demo.id > 0) {
        let resp = await put<boolean>("/demos", demo);
        if (resp.isSuccess) {
          toast.success("update success");
          setFilterPagedResultRequest((pre) => ({ ...pre, page: 1 }));
          handleCloseDialog();
        } else {
          toast.error(resp.message);
        }
      } else {
        let resp = await post<boolean>("/demos", demo);
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

  //Table Column Definition
  const columns: GridColDef[] = [
    // { field: 'id', headerName: 'ID', width: 90, },
    { field: "title", headerName: "Title", width: 180 },
    { field: "mark", headerName: "Mark", width: 220 },
    { field: "count", headerName: "Count", width: 100 },
    {
      field: "active",
      headerName: "Active",
      width: 180,
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
              <Tooltip title="Active">
                <CheckCircleIcon color="success" fontSize="small" />
              </Tooltip>
            ) : (
              <Tooltip title="not active">
                <CancelIcon color="error" fontSize="small" />
              </Tooltip>
            )}
            <Typography variant="body2">
              {params.value ? "Active" : "not active"}
            </Typography>
          </Stack>
        );
      },
    },
    {
      field: "dataTime",
      headerName: "DataTime",
      width: 250,
      valueFormatter: (value) => {
        if (!value) return "-";
        return new Date(value).toLocaleString();
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <Box>
          {/* TODO: Wrap your button component with <BtnPermissionControl> like the following */}
          {/* permission control wrapping */}
          <BtnPermissionControl hasAccess={hasPermission(`${prefix}:view`)}>
            <IconButton>
              <VisibilityIcon />
            </IconButton>
          </BtnPermissionControl>
          <BtnPermissionControl hasAccess={hasPermission(`${prefix}:update`)}>
            <IconButton onClick={() => handleUpdate(params.row as DemoDto)}>
              <EditIcon />
            </IconButton>
          </BtnPermissionControl>
          <BtnPermissionControl hasAccess={hasPermission(`${prefix}:delete`)}>
            <IconButton onClick={() => handleDelete(params.id)}>
              <DeleteIcon />
            </IconButton>
          </BtnPermissionControl>
          {/* TODO: End of Permission control wrapping */}
        </Box>
      ),
    },
  ];

  const handleUpdate = async (demo: DemoDto | null) => {
    let resp = await get<DemoDto>(`demos/${demo?.id}`);
    if (resp.isSuccess) {
      let demoDetail = resp.data;
      let updateDemoDto: UpdateDemoDto = {
        id: demoDetail.id,
        title: demoDetail.title,
        mark: demoDetail.mark,
        count: demoDetail.count,
        acitve: demoDetail.acitve,
        dataTime: new Date(demoDetail.dataTime),
      };
      handleOpenDialog(updateDemoDto);
    } else {
      toast.error(resp.message);
    }
  };

  const handleComfirmDelete = async () => {
    let resp = await del<boolean>(`demos/${deData}`);
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
                message="Loading demos, please wait..."
            /> */}
      <h2>Button Permission Control Demonstration Page</h2>
      <div>
        <h3>
          具体应添加的代码请参见
          src/pages/dummy/index.tsx，所有新增代码均有TODO注释
        </h3>
        <h4>注意事项</h4>
        <ul>
          <li>
            所有的权限的组成都是"<b>prefix:suffix</b>"
            ，prefix代表模块，suffix代表操作
          </li>
          <li>
            每个module都对应一个viewall权限，如dummy:viewall，并由这个viewall权限获得当前页面的prefix
          </li>
          <li>
            每个button对应一个权限suffix，如：create, view, update,
            delete，assign
          </li>
          <li>
            目前所有模块在数据库中都有对应的viewall, create, view, update,
            delete权限，role和user模块额外有对应的assign权限
          </li>
          <li>
            当前index.tsx文件基于src/pages/demo/index.tsx，如果你是按照老师给的demo/index.tsx完成的page
            content可以直接套用这个index里的permission control wrapping （搜索
            TODO），不需修改其他文件
            <br></br>
            <ul>
              ✅已完成添加以下模块的PermissionControl，可以直接在对应的module/index.tsx搜索：permission
              control
              <li>
                <b>Dashboard</b>
              </li>
              <li>
                <b>System Management</b>
                <ul>✅Role</ul>
                <ul>✅User</ul>
                <ul>✅Menu</ul>
                <ul>Permission</ul>
              </li>
              <li>
                <b>Course Management</b>
                <ul>✅Course</ul>
                <ul>✅Chapter</ul>
                <ul>🤔Category -- 已自带permissionion control，未新增</ul>
                <ul>✅Course Offering</ul>
                <ul>⌛️Carousel -- 暂无</ul>
              </li>
              <li>
                <b>Exam Management</b>
                <ul>⌛️Question Bank -- 等待最终版</ul>
              </li>
              <li>
                <b>Dummy Testing</b>
                <ul>✅Button Level Permission Control</ul>
              </li>
            </ul>
          </li>
          <li>
            <b>
              <u>
                请确保你重新创建了backend数据库，否则i没有permission数据会报错
              </u>
            </b>
          </li>
        </ul>
      </div>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <TextField
          variant="outlined"
          placeholder="Search demos..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          InputProps={{
            startAdornment: (
              <SearchIcon sx={{ color: "action.active", mr: 1 }} />
            ),
          }}
          sx={{ width: 300 }}
        />
        {/* TODO: Wrap your button component like the following, and change the "create" to the action you want to wrap, e.g. "assign" */}
        {/* permission control wrapping */}
        {hasPermission(`${prefix}:create`) && (
          <Button
            disabled={loading}
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog(null)}
          >
            Add Dummy Control Button
          </Button>
        )}
        {/* TODO: End of Permission control wrapping */}

        {hasPermission(`${prefix}:assign`) && (
          <Button
            disabled={loading}
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog(null)}
          >
            Assign Dummy Button
          </Button>
        )}
      </Box>
      <DemoList
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
        demo={currentDemo}
        onSave={handleSaveDemo}
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

export default Demos;
