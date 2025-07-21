import * as React from "react";
import { useEffect, useState } from "react";
import {
  Box,
  Button,
  IconButton,
  TextField,
} from "@mui/material";

import { GridColDef, GridPaginationModel, GridRowId, GridRowSelectionModel } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";

import toast from "react-hot-toast";
import QuestionList from "./questionList";
import {
  FilterPagedResultRequestDto,
  PagedResultDto,
} from "../../types/types";
import { del, get, post, put } from "../../request/axios/index";
import { CreateQuestionDto, QuestionDto, UpdateQuestionDto } from "../../types/question";
import OperateConfirmationDialog from "../../components/OperateConfirmationDialog";
import useDebounce from "../../hooks/useDebounce";
import PermissionControl from "../../components/PermissionControl";
import AddUpdateDialog from "./addUpdateDialog";

const Questions: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<UpdateQuestionDto | null>(null);
  const [searchText, setSearchText] = useState("");

  const searchQuery = useDebounce(searchText, 500); //use Debounce Hook
  useEffect(() => {
    setFilterPagedResultRequest((pre) => ({ ...pre, filter: searchQuery }));
  }, [searchQuery]);

  /**
   * open Dialog
   * @param user
   */
  const handleOpenDialog = (question: UpdateQuestionDto | null) => {
    setCurrentQuestion(question);
    setOpenDialog(true);
  };

  /**
   * Close Dialog
   */
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentQuestion(null);
  };

  /**
   * Save question (add or modify)
   * @param question
   */
  const handleSaveQuestion = async (question: CreateQuestionDto | UpdateQuestionDto | null) => {
    if (question) {
      const {options, ...questionData} = question

      if (question.id > 0) {
        let resQuestion = await put<boolean>(`/questions/${question.id}`, questionData);
        let resOption = await put<boolean>(`/options/question/${question.id}`, options);

        if (resQuestion.isSuccess && resOption.isSuccess) {
          toast.success("update success");
          setFilterPagedResultRequest((pre) => ({ ...pre, page: 1 }));
          handleCloseDialog();
        } else {
          toast.error(resQuestion.message);
        }
      } else {
        let resp = await post<boolean>("/questions", question);
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
  const [pageData, setPageData] = useState<PagedResultDto<QuestionDto>>({
    items: [],
    total: 0
  });

  useEffect(() => {
    let getPageData = async () => {
      setLoading(true);
      try {
        let filterPagedResultRequestDto: FilterPagedResultRequestDto = {
          ...filterPagedResultRequest,
        };
        let filter = filterPagedResultRequest.filter ? `&title=${filterPagedResultRequestDto.filter}` : ""
        let resp = await get<PagedResultDto<QuestionDto>>(
          `/questions/?page=${filterPagedResultRequestDto.page}&limit=${filterPagedResultRequestDto.pageSize}${filter}`
        );
        console.log(resp.data)
        if (resp.isSuccess) {
          setPageData(resp.data);
        }
      } finally {
        setLoading(false);
      }
    };
    getPageData();
  }, [filterPagedResultRequest]);

  //Table Column Definition
  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 90, },
    { field: "category", headerName: "Category", width: 120 },
    { field: "type", headerName: "Type", width: 120 },
    { field: "content", headerName: "Question", flex:1, minWidth: 350 },
    { field: "difficulty", headerName: "Difficulty", width: 100 },
    { field: "options", 
      headerName: "Options Count", 
      width: 130, 
      valueGetter: (params: string[]) => params.length || 0,
    },
    {
      field: "updatedAt",
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
          <PermissionControl permission="">
            <IconButton onClick={() => handleUpdate(params.row as QuestionDto)}>
              <EditIcon />
            </IconButton>
          </PermissionControl>
          <PermissionControl permission="">
            <IconButton onClick={() => handleDelete(params.id)}>
              <DeleteIcon />
            </IconButton>
          </PermissionControl>
        </Box>
      ),
    },
  ];

  const handleUpdate = async (question: QuestionDto | null) => {
    let resp = await get<QuestionDto>(`questions/${question?.id}`);
    if (resp.isSuccess) {
      let questionDetail = resp.data;
      let updateQuestionDto: UpdateQuestionDto = {
        id: questionDetail.id,
        category: questionDetail.category,
        type: questionDetail.type,
        content: questionDetail.content,
        difficulty: questionDetail.difficulty,
        options: questionDetail.options ? questionDetail.options : [],
        dataTime: new Date(),
      };
      handleOpenDialog(updateQuestionDto);
    } else {
      toast.error(resp.message);
    }
  };

  const [deleteMode, setDelMode] = useState<"single" | "bulk"> ("single")
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [deleteId, setDelData] = useState(0);

  const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>([]);
  const onRowSelectionModelChange = (newRowSelectionModel: GridRowSelectionModel) => {
    setRowSelectionModel(newRowSelectionModel)
  }

  const handleDelete = async (id: GridRowId) => {
    setDelMode("single")
    setDelData(id as number);
    setConfirmDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    let resp = await del<boolean>(`questions/${deleteId}`);
    if (resp.status === 204) {
      setFilterPagedResultRequest((pre) => ({ ...pre, page: 1 }));
      toast.success("delete success");
    } else {
      toast.error(resp.message);
    }
    setConfirmDialogOpen(false);
    console.log("handleConfirmDelete", deleteId);
  };

  const handleBulkDelete= async() => {
    setDelMode("bulk")
    setConfirmDialogOpen(true);
  }

  const handleConfirmBulkDelete = async () => {
    const ids = rowSelectionModel.map(Number)
    let resp = await del<boolean>("questions/bulk", {ids});
    if (resp.status === 204) {
      setFilterPagedResultRequest((pre) => ({ ...pre, page: 1 }));
      toast.success("delete success");
    } else {
      toast.error(resp.message);
    }
    setConfirmDialogOpen(false);
    console.log("handleConfirmDelete", deleteId);
  }

  const handleConfirmCancel = () => {
    setConfirmDialogOpen(false);
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
    <Box sx={{ height: 650, width: "100%", p: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <TextField
          variant="outlined"
          placeholder="Search questions..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          InputProps={{
            startAdornment: (
              <SearchIcon sx={{ color: "action.active", mr: 1 }} />
            ),
          }}
          sx={{ width: 300 }}
        />
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1, minWidth: "25%"}}>
          <Button 
            size="small"
            disabled={rowSelectionModel.length === 0}
            variant="contained"
            onClick={() => handleBulkDelete()}
          >
            <DeleteIcon />
          </Button>

          <Button
            disabled={loading}
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog(null)}
          >
            Add Question
          </Button>
        </Box>
      </Box>

      <QuestionList
        loading={loading}
        columns={columns}
        pagedResult={pageData}
        page={filterPagedResultRequest.page - 1}
        pageSize={filterPagedResultRequest.pageSize}
        onPaginationModelChange={onPaginationModelChange}
        rowSelectionModel={rowSelectionModel}
        onRowSelectionModelChange={onRowSelectionModelChange}
      />

      <AddUpdateDialog
        open={openDialog}
        onClose={handleCloseDialog}
        question={currentQuestion}
        onSave={handleSaveQuestion}
      />

      <OperateConfirmationDialog
        open={confirmDialogOpen}
        title="confirm delete"
        content={
          deleteMode === 'single'
            ? "Are you sure you want to delete this question? This action cannot be undone."
            : `Are you sure you want to delete ${rowSelectionModel.length} selected questions? This action cannot be undone.`
        }
        onConfirm={deleteMode === "single" ? handleConfirmDelete : handleConfirmBulkDelete}
        onCancel={handleConfirmCancel}
      />
    </Box>
  );
};



export default Questions;
