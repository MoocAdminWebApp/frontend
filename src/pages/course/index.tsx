import React from "react";
import {
  Box,
  Button,
  TextField,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import {
  GridColDef,
  GridPaginationModel,
} from "@mui/x-data-grid";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import SearchIcon from "@mui/icons-material/Search";
import toast from "react-hot-toast";

import { get, post, put, del } from "../../request/axios";
import useDebounce from "../../hooks/useDebounce";
import CourseList from "./courseList";
import AddUpdateCourseDialog from "./addUpdateCourseDialog";
import OperateConfirmationDialog from "../../components/OperateConfirmationDialog";
import { CourseDto, CreateCourseDto, UpdateCourseDto } from "../../types/course";
import { FilterPagedResultRequestDto, PagedResultDto } from "../../types/types";
import { formatDateValue } from "../../utils/formatDate";
import UserNameCell from "../../components/UserNameCell";

const CoursePage: React.FC = () => {
  const [loading, setLoading] = React.useState(false);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [currentCourse, setCurrentCourse] = React.useState<UpdateCourseDto | null>(null);
  const [searchText, setSearchText] = React.useState("");
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [deleteId, setDeleteId] = React.useState<number>(0);
  const [filter, setFilter] = React.useState<FilterPagedResultRequestDto>({
    page: 1,
    pageSize: 10,
  });
  const [pagedResult, setPagedResult] = React.useState<PagedResultDto<CourseDto>>({
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
      const resp = await get<PagedResultDto<CourseDto>>(
        `/courses/page`,
        {
          page: filter.page,
          pageSize: filter.pageSize,
          filters: filter.filter ? JSON.stringify({ courseName: filter.filter }) : undefined,
          fuzzyKeys: "courseName",
        }
      );
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

  const handleSave = async (course: CreateCourseDto | UpdateCourseDto) => {
    if (!course) return;

    let resp;
    const isUpdate = "id" in course && typeof course.id === "number" && course.id > 0;

    if (isUpdate) {
      resp = await put(`/courses/${course.id}`, course);
    } else {
      resp = await post("/courses", course);
    }

    if (resp.isSuccess) {
      toast.success(isUpdate ? "Updated successfully" : "Created successfully");
      setFilter((prev) => ({ ...prev, page: 1 }));
      setOpenDialog(false);
    } else {
      toast.error(resp.message || "Operation failed");
    }
  };

  const handleEdit = async (row: CourseDto) => {
    const resp = await get<any>(`/courses/${row.id}`);
    if (resp.isSuccess && resp.data) {
      setCurrentCourse(resp.data.data);
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
    { field: "courseName", headerName: "Course Name", flex: 1 },
    { field: "courseDescription", headerName: "Description", flex: 1 },
    { field: "courseCode", headerName: "Course Code", flex: 1 },
    {
      field: "status",
      headerName: "Status",
      width: 130,
      renderCell: ({ value }) =>
        value === "PUBLISHED" ? (
          <Stack direction="row" alignItems="center" spacing={1}>
            <CheckCircleIcon color="success" fontSize="small" />
            <Typography variant="body2">Published</Typography>
          </Stack>
        ) : value === "DRAFT" ? (
          <Stack direction="row" alignItems="center" spacing={1}>
            <CancelIcon color="warning" fontSize="small" />
            <Typography variant="body2">Draft</Typography>
          </Stack>
        ) : (
          <Stack direction="row" alignItems="center" spacing={1}>
            <CancelIcon color="error" fontSize="small" />
            <Typography variant="body2">Archived</Typography>
          </Stack>
        ),
    },
    {
      field: "instructor",
      headerName: "Instructor",
      flex: 1,
      renderCell: ({ row }) => <UserNameCell user={row.instructor || "N/A"} />,
    },
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

  console.log("currentCourse:", currentCourse);
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
            setCurrentCourse(null);
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
      key={currentCourse?.id ?? "new"}
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        data={currentCourse}
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

export default CoursePage;
