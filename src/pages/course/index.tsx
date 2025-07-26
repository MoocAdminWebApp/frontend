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
import CourseList from "./courseList";
import AddUpdateDialog from "./addUpdateCourseDialog";
import OperateConfirmationDialog from "../../components/OperateConfirmationDialog";
import {
  CreateCourseDto,
  UpdateCourseDto,
} from "../../types/course";
import {
  ApiResponseResult,
  FilterPagedResultRequestDto,
  PagedResultDto,
} from "../../types/types";

const isUpdateDto = (
  dto: CreateCourseDto | UpdateCourseDto | null
): dto is UpdateCourseDto =>
  dto !== null && "id" in dto && typeof dto.id === "number" && dto.id > 0;

function formatErrorMessage(msg: any): string {
  if (!msg) return "Unknown error";
  if (Array.isArray(msg)) {
    return msg
      .map((e) => (typeof e === "object" && "msg" in e ? e.msg : JSON.stringify(e)))
      .join(", ");
  }
  if (typeof msg === "object") {
    if ("msg" in msg) return msg.msg;
    return JSON.stringify(msg);
  }
  return String(msg);
}

const Course: React.FC = () => {
  const [loading, setLoading] = React.useState(false);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [currentItem, setCurrentItem] = React.useState<UpdateCourseDto | null>(null);
  const [searchText, setSearchText] = React.useState("");
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [deleteId, setDeleteId] = React.useState<number>(0);
  const [filter, setFilter] = React.useState<FilterPagedResultRequestDto>({
    page: 1,
    pageSize: 10,
  });
  const [pagedResult, setPagedResult] = React.useState<PagedResultDto<UpdateCourseDto>>({
    items: [],
    total: 0,
  });

  const searchQuery = useDebounce(searchText, 500);

  const load = async () => {
  setLoading(true);

  const params: any = {
    page: filter.page,
    pageSize: filter.pageSize,
    fuzzyKeys: "courseName",
  };

  if (searchQuery?.trim()) {
    params.filters = JSON.stringify({ filter: searchQuery.trim() });
  }

  const resp = await get<ApiResponseResult<PagedResultDto<UpdateCourseDto>>>(
    "/courses/page",
    params
  );

  if (resp.isSuccess && resp.data) {
    setPagedResult({
      items: resp.data.data.items ?? [],
      total: resp.data.data.total ?? 0,
    });
  }

  setLoading(false);
};


  React.useEffect(() => {
    load();
  }, [filter, searchQuery]);

  const handlePaginationChange = (model: GridPaginationModel) => {
    setFilter((prev) => ({
      ...prev,
      page: model.page + 1,
      pageSize: model.pageSize,
    }));
  };

  const handleSave = async (data: CreateCourseDto | UpdateCourseDto | null) => {
    if (!data) return;
    const resp = isUpdateDto(data)
      ? await put(`/courses/${data.id}`, data)
      : await post("/courses", data);

    if (resp.isSuccess) {
      toast.success(isUpdateDto(data) ? "Updated successfully" : "Created successfully");
      setFilter((prev) => ({ ...prev, page: 1 })); // 保存后跳回第一页重新加载
      setOpenDialog(false);
    } else {
      toast.error(formatErrorMessage(resp.message));
    }
  };

  const handleEdit = async (row: UpdateCourseDto) => {
    const resp = await get<UpdateCourseDto>(`/courses/${row.id}`);
    if (resp.isSuccess) {
      setCurrentItem(resp.data);
      setOpenDialog(true);
    } else {
      toast.error(formatErrorMessage(resp.message));
    }
  };

  const handleDelete = async () => {
    const resp = await del(`/courses/${deleteId}`);
    if (resp.isSuccess) {
      toast.success("Deleted successfully");
      await load();
    } else {
      toast.error(formatErrorMessage(resp.message));
    }
    setConfirmOpen(false);
  };

  const columns: GridColDef[] = [
    { field: "name", headerName: "Name", flex: 1 },
    { field: "description", headerName: "Description", flex: 2 },
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
          placeholder="Search courses..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          InputProps={{ startAdornment: <SearchIcon sx={{ mr: 1 }} /> }}
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
          Add Course
        </Button>
      </Box>

      <CourseList<UpdateCourseDto>
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
        data={currentItem}
        onSave={handleSave}
      />

      <OperateConfirmationDialog
        open={confirmOpen}
        title="Confirm Delete"
        content="Are you sure you want to delete this course?"
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </Box>
  );
};

export default Course;
