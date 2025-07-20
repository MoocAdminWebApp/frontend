import * as React from "react";
import { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Stack,
  Typography,
  IconButton,
  Tooltip,
  Dialog,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import toast from "react-hot-toast";

import CourseList from "./courseList";
import AddUpdateCourseDialog from "./addUpdateCourseDialog";

import { GridRowId } from "@mui/x-data-grid";

interface Instructor {
  id: number;
  name: string;
}

export interface Course {
  id: number;
  title: string;
  description: string;
  status: "draft" | "published";
  instructor: Instructor;
  active: boolean; // stimulated, whether course is activated
  createdAt: string;
}

const mockCourses: Course[] = [
  {
    id: 1,
    title: "React Basics",
    description: "Learn React from scratch",
    status: "published",
    instructor: { id: 101, name: "Alice" },
    active: true,
    createdAt: "2025-07-01T10:00:00Z",
  },
  {
    id: 2,
    title: "Advanced Node.js",
    description: "Deep dive into Node.js internals",
    status: "draft",
    instructor: { id: 102, name: "Bob" },
    active: false,
    createdAt: "2025-07-10T14:30:00Z",
  },
  {
    id: 3,
    title: "TypeScript Mastery",
    description: "Master TypeScript with projects",
    status: "published",
    instructor: { id: 103, name: "Carol" },
    active: true,
    createdAt: "2025-07-15T09:20:00Z",
  },
];

const PAGE_SIZE_OPTIONS = [5, 10, 20];

const CoursePage: React.FC = () => {
  // page status
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [courses, setCourses] = useState<Course[]>(mockCourses);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>(mockCourses);

  // pagination status
  const [page, setPage] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(PAGE_SIZE_OPTIONS[0]);

  // dialog control
  const [openDialog, setOpenDialog] = useState(false);
  const [currentCourse, setCurrentCourse] = useState<Course | null>(null);

  // delete confirmation
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  // filtered searching, simple text including matching
  useEffect(() => {
    if (!searchText.trim()) {
      setFilteredCourses(courses);
    } else {
      const lower = searchText.toLowerCase();
      setFilteredCourses(
        courses.filter(
          (c) =>
            c.title.toLowerCase().includes(lower) ||
            c.description.toLowerCase().includes(lower) ||
            c.instructor.name.toLowerCase().includes(lower)
        )
      );
    }
    setPage(0); // return to first page when searching
  }, [searchText, courses]);

  // definition
  const columns = [
    {
      field: "title",
      headerName: "Title",
      width: 220,
    },
    {
      field: "description",
      headerName: "Description",
      width: 300,
    },
    {
      field: "instructor",
      headerName: "Instructor",
      width: 150,
      valueGetter: (params: any) => params.row.instructor?.name ?? "-",
    },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      renderCell: (params: any) => (
        <Typography
          color={params.value === "published" ? "success.main" : "text.secondary"}
          variant="body2"
        >
          {params.value === "published" ? "Published" : "Draft"}
        </Typography>
      ),
    },
    {
      field: "active",
      headerName: "Active",
      width: 100,
      renderCell: (params: any) => (
        <Tooltip title={params.value ? "Active" : "Inactive"}>
          {params.value ? (
            <CheckCircleIcon color="success" fontSize="small" />
          ) : (
            <CancelIcon color="error" fontSize="small" />
          )}
        </Tooltip>
      ),
    },
    {
      field: "createdAt",
      headerName: "Created At",
      width: 180,
      valueFormatter: (params: any) => {
        if (!params.value) return "-";
        return new Date(params.value).toLocaleString();
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      renderCell: (params: any) => (
        <Stack direction="row" spacing={1}>
          <IconButton onClick={() => handleEdit(params.row)} size="small" color="primary">
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleDelete(params.row.id)} size="small" color="error">
            <DeleteIcon />
          </IconButton>
        </Stack>
      ),
    },
  ];

  const handleEdit = (course: Course) => {
    setCurrentCourse(course);
    setOpenDialog(true);
  };

  const handleDelete = (id: number) => {
    setDeleteId(id);
    setConfirmDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deleteId !== null) {
      // stimulating deleting
      setCourses((prev) => prev.filter((c) => c.id !== deleteId));
      toast.success("Course deleted");
    }
    setConfirmDeleteOpen(false);
    setDeleteId(null);
  };

  const handleCancelDelete = () => {
    setConfirmDeleteOpen(false);
    setDeleteId(null);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setCurrentCourse(null);
  };

  const handleSaveCourse = (courseData: Course | null) => {
    if (!courseData) {
      handleDialogClose();
      return;
    }
    if (courseData.id && courseData.id > 0) {
      // updating logic
      setCourses((prev) =>
        prev.map((c) => (c.id === courseData.id ? { ...courseData } : c))
      );
      toast.success("Course updated");
    } else {
      // id++
      const newId = Math.max(...courses.map((c) => c.id)) + 1;
      setCourses((prev) => [...prev, { ...courseData, id: newId }]);
      toast.success("Course created");
    }
    handleDialogClose();
  };

  // calculating pagination data
  const pagedCourses = React.useMemo(() => {
    const start = page * pageSize;
    return filteredCourses.slice(start, start + pageSize);
  }, [filteredCourses, page, pageSize]);

  return (
    <Box sx={{ p: 3, width: "100%", height: "100%" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <TextField
          variant="outlined"
          placeholder="Search courses..."
          size="small"
          sx={{ width: 300 }}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          InputProps={{
            startAdornment: <SearchIcon sx={{ mr: 1, color: "action.active" }} />,
          }}
        />
        <Button
          variant="contained"
          startIcon={<AddIcon />}
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
        pagedResult={{ items: pagedCourses, total: filteredCourses.length }}
        page={page}
        pageSize={pageSize}
        pageSizeOptions={PAGE_SIZE_OPTIONS}
        onPaginationModelChange={({ page: newPage, pageSize: newPageSize }) => {
          setPage(newPage);
          setPageSize(newPageSize);
        }}
      />

      <AddUpdateCourseDialog
        open={openDialog}
        onClose={handleDialogClose}
        course={currentCourse}
        onSave={handleSaveCourse}
      />

      {/* delete confirmation dialog */}
      <Dialog open={confirmDeleteOpen} onClose={handleCancelDelete}>
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" mb={2}>
            Confirm Delete
          </Typography>
          <Typography mb={3}>
            Are you sure you want to delete this course? This action cannot be
            undone.
          </Typography>
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button onClick={handleCancelDelete}>Cancel</Button>
            <Button variant="contained" color="error" onClick={handleConfirmDelete}>
              Delete
            </Button>
          </Stack>
        </Box>
      </Dialog>
    </Box>
  );
};

export default CoursePage;
