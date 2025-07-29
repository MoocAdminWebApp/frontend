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
import CourseOfferingList from "./courseOfferingList";
import AddUpdateDialog from "./addUpdateDialog";
import OperateConfirmationDialog from "../../components/OperateConfirmationDialog";
import {
  CreateCourseOfferingDto,
  UpdateCourseOfferingDto,
} from "../../types/courseOffering";
import {
  ApiResponseResult,
  FilterPagedResultRequestDto,
  PagedResultDto,
} from "../../types/types";

const isUpdateDto = (
  dto: CreateCourseOfferingDto | UpdateCourseOfferingDto | null
): dto is UpdateCourseOfferingDto =>
  dto !== null &&
  "id" in dto &&
  typeof dto.id === "number" &&
  dto.id > 0;

const CourseOffering: React.FC = () => {
  const [loading, setLoading] = React.useState(false);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [currentItem, setCurrentItem] =
    React.useState<UpdateCourseOfferingDto | null>(null);
  const [searchText, setSearchText] = React.useState("");
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [deleteId, setDeleteId] = React.useState<number>(0);
  const [filter, setFilter] = React.useState<FilterPagedResultRequestDto>({
    page: 1,
    pageSize: 10,
  });
  const [pagedResult, setPagedResult] =
    React.useState<PagedResultDto<UpdateCourseOfferingDto>>({
      items: [],
      total: 0,
    });

  const searchQuery = useDebounce(searchText, 500);
  React.useEffect(() => {
    setFilter((prev) => ({ ...prev, filter: searchQuery }));
  }, [searchQuery]);

  const load = async () => {
      setLoading(true);
      const resp = await get<ApiResponseResult<PagedResultDto<UpdateCourseOfferingDto>>>(
        `/courseofferings/by-page`,
        {
          page: filter.page,
          pageSize: filter.pageSize,
          fuzzyKeys: "courseName,teacherName",
          filter: searchQuery ?? "",
        }
      );
      console.log("resp",resp)
      if (resp.isSuccess&&resp.data) {
        const result = {
          items: resp.data.data.items ?? [],
          total: resp.data.data.total ?? 0,
        };
        
        setPagedResult(result);
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
    data: CreateCourseOfferingDto | UpdateCourseOfferingDto | null
  ) => {
    if (!data) return;

    const resp = isUpdateDto(data)
      ? await put(`/courseofferings/${data.id}`, data)
      : await post("/courseofferings", data);

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

  const handleEdit = async (row: UpdateCourseOfferingDto) => {
    const resp = await get<UpdateCourseOfferingDto>(
      `/courseofferings/${row.id}`
    );
    if (resp.isSuccess) {
      setCurrentItem(resp.data);
      setOpenDialog(true);
    } else {
      toast.error(resp.message);
    }
  };

 
  
  const handleDelete = async () => {
  const resp = await del(`/courseofferings/${deleteId}`);

  const isOk = (resp as any).isSuccess ?? ((resp as any).status === 200 || (resp as any).status === 204);

  if (isOk) {
    toast.success("Deleted successfully");
    // await load();
    setFilter((prev) => ({ ...prev, page: 1 }));
  } else {
    toast.error((resp as any).message || "Delete failed");
  }

  setConfirmOpen(false);
};


  const columns: GridColDef[] = [
    { field: "courseName", headerName: "Course Name", flex: 1 },
    { field: "teacherName", headerName: "Teacher Name", flex: 1 },
    { field: "semester", headerName: "Semester", flex: 1 },
    { field: "capacity", headerName: "Capacity", flex:1},
    { field: "location", headerName: "Location", flex: 1 },
    { field: "schedule", headerName: "Schedule", flex: 1 },
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

      <CourseOfferingList<UpdateCourseOfferingDto>
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

export default CourseOffering;
