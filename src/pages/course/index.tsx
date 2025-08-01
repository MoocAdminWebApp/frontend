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
import AddUpdateCourseDialog from "./addUpdateCourseDialog";
import OperateConfirmationDialog from "../../components/OperateConfirmationDialog";
import {
  CreateCourseDto,
  UpdateCourseDto,
} from "../../types/course";
import {
  FilterPagedResultRequestDto,
  PagedResultDto,
} from "../../types/types";
import { formatDateValue } from "../../utils/formatDate"; // 如果你需要格式化时间列

const isUpdateDto = (
  dto: CreateCourseDto | UpdateCourseDto | null
): dto is UpdateCourseDto =>
  dto !== null && "id" in dto && typeof dto.id === "number" && dto.id > 0;

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

  React.useEffect(() => {
    setFilter((prev) => ({ ...prev, filter: searchQuery }));
  }, [searchQuery]);

  React.useEffect(() => {
    const load = async () => {
      setLoading(true);

      const params: any = {
        page: filter.page,
        pageSize: filter.pageSize,
        // 你后端接口参数中使用的是courseName作为模糊搜索关键字
        fuzzyKeys: "courseName",
      };

      if (filter.filter && filter.filter.trim()) {
        params.filters = JSON.stringify({ courseName: filter.filter.trim() });
      }

      const resp = await get<PagedResultDto<UpdateCourseDto>>("/courses/page", params);

      if (resp.isSuccess && resp.data) {
        setPagedResult(resp.data);
      } else {
        toast.error(resp.message || "Failed to load courses");
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

  const handleSave = async (data: CreateCourseDto | UpdateCourseDto | null) => {
    if (!data) return;

    const resp = isUpdateDto(data)
      ? await put(`/courses/${data.id}`, data)
      : await post("/courses", data);

    if (resp.isSuccess) {
      toast.success(isUpdateDto(data) ? "Updated successfully" : "Created successfully");
      setFilter((prev) => ({ ...prev, page: 1 }));
      setOpenDialog(false);
    } else {
      toast.error(resp.message || "Operation failed");
    }
  };

  const handleEdit = async (row: UpdateCourseDto) => {
    const resp = await get<UpdateCourseDto>(`/courses/${row.id}`);
    if (resp.isSuccess && resp.data) {
      setCurrentItem(resp.data);
      setOpenDialog(true);
    } else {
      toast.error(resp.message || "Failed to load course");
    }
  };

  const handleDelete = async () => {
    const resp = await del(`/courses/${deleteId}`);
    if (resp.isSuccess) {
      toast.success("Deleted successfully");
      setFilter((prev) => ({ ...prev, page: 1 }));
    } else {
      toast.error(resp.message || "Delete failed");
    }
    setConfirmOpen(false);
  };

  const columns: GridColDef[] = [
    { field: "name", headerName: "Name", flex: 1 },
    { field: "description", headerName: "Description", flex: 2 },
    {
      field: "createdAt",
      headerName: "Created At",
      flex: 1,
      valueFormatter: formatDateValue,
    },
    {
      field: "updatedAt",
      headerName: "Updated At",
      flex: 1,
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
          Add Course
        </Button>
      </Box>

      <CourseList
        loading={loading}
        columns={columns}
        pagedResult={pagedResult}
        page={filter.page - 1}
        pageSize={filter.pageSize}
        onPaginationModelChange={handlePaginationChange}
      />

      <AddUpdateCourseDialog
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
