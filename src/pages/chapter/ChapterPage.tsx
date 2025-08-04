import * as React from "react";
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
import ChapterList from "./chapterList";
import AddUpdateChapterDialog from "./addUpdateChapterDialog";
import OperateConfirmationDialog from "../../components/OperateConfirmationDialog";
import { ChapterDto, CreateChapterDto, UpdateChapterDto } from "../../types/chapter";

import { FilterPagedResultRequestDto, PagedResultDto } from "../../types/types";
import { formatDateValue } from "../../utils/formatDate";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";

// permission control imports
import { useEffect, useRef, useState } from "react";
import { useActiveMenuIdFromRoute } from "../../hooks/useActiveMenuIdFromRoute";
import BtnPermissionControl from "../../components/permissionControl/BtnPermissionControl";
import PagePermissionControl from "../../components/permissionControl/PagePermissionControl";
import { usePagePrefixFromMenuId } from "../../hooks/usePagePrefixFromMenuId";
import PageLoading from "../../components/PageLoading";

interface ChapterPageProps {
  courseId: number; // 必须传入课程ID，章节归属于此课程
}

const ChapterPage: React.FC<ChapterPageProps> = ({ courseId }) => {
  const [loading, setLoading] = React.useState(false);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [currentChapter, setCurrentChapter] = React.useState<UpdateChapterDto | null>(null);
  const [searchText, setSearchText] = React.useState("");
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [deleteId, setDeleteId] = React.useState<number>(0);
  const [filter, setFilter] = React.useState<FilterPagedResultRequestDto>({
    page: 1,
    pageSize: 10,
  });
  const [pagedResult, setPagedResult] = React.useState<PagedResultDto<ChapterDto>>({
    items: [],
    total: 0,
  });

  const loginUser = useSelector((state: RootState) => state.auth.user);

  const searchQuery = useDebounce(searchText, 500);

  React.useEffect(() => {
    setFilter((prev) => ({ ...prev, filter: searchQuery }));
  }, [searchQuery]);

  React.useEffect(() => {
    const load = async () => {
      setLoading(true);
      const resp = await get<PagedResultDto<ChapterDto>>(
        `/chapters/page`,
        {
          page: filter.page,
          pageSize: filter.pageSize,
          filters: JSON.stringify({
            title: filter.filter || undefined,
            courseId,
          }),
          fuzzyKeys: "title",
        }
      );
      if (resp.isSuccess && resp.data) {
        setPagedResult(resp.data);
      } else {
        toast.error(resp.message || "Failed to load chapters");
      }
      setLoading(false);
    };
    load();
  }, [filter, courseId]);

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

  const handlePaginationChange = (model: GridPaginationModel) => {
    setFilter((prev) => ({
      ...prev,
      page: model.page + 1,
      pageSize: model.pageSize,
    }));
  };

  const handleSave = async (chapter: CreateChapterDto | UpdateChapterDto | null) => {
    if (!chapter) return;
    let resp;
    const payload = { ...chapter, courseId, updatedBy: loginUser?.userId,createdBy: loginUser?.userId, };
    if ((chapter as UpdateChapterDto).id) {
      resp = await put(`/chapters/${(chapter as UpdateChapterDto).id}`, payload);
    } else {
      resp = await post("/chapters", payload);
    }
    console.log(resp)
    if (resp.isSuccess) {
      toast.success((chapter as UpdateChapterDto).id ? "Updated successfully" : "Created successfully");
      setFilter((prev) => ({ ...prev, page: 1 }));
      setOpenDialog(false);
    } else {
      toast.error(resp.message || "Operation failed");
    }
  };

  const handleEdit = async (row: ChapterDto) => {
    const resp = await get<ChapterDto>(`/chapters/${row.id}`);
    if (resp.isSuccess && resp.data) {
      setCurrentChapter(resp.data);
      setOpenDialog(true);
    } else {
      toast.error(resp.message || "Failed to load chapter");
    }
  };

  const handleDelete = async () => {
    const resp = await del(`/chapters/${deleteId}`);
    if (resp.isSuccess) {
      toast.success("Deleted successfully");
      setFilter((prev) => ({ ...prev, page: 1 }));
    } else {
      toast.error(resp.message || "Delete failed");
    }
    setConfirmOpen(false);
  };

  const columns: GridColDef[] = [
    { field: "chapterNumber", headerName: "Chapter No.", width: 130 },
    { field: "title", headerName: "Title", flex: 1 },
    { field: "description", headerName: "Description", flex: 1 },
    {
      field: "status",
      headerName: "Status",
      width: 120,
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
            <Typography variant="body2">Hidden</Typography>
          </Stack>
        ),
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
          {/* permission control wrapping */}
          <BtnPermissionControl hasAccess={hasPermission(`${prefix}:update`)}>
            <IconButton onClick={() => handleEdit(row)}>
              <EditIcon />
            </IconButton>
          </BtnPermissionControl>
          <BtnPermissionControl hasAccess={hasPermission(`${prefix}:delete`)}>
            <IconButton
              onClick={() => {
                setDeleteId(row.id);
                setConfirmOpen(true);
              }}
            >
              <DeleteIcon />
            </IconButton>
          </BtnPermissionControl>
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <TextField
          variant="outlined"
          placeholder="Search chapters..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          InputProps={{
            startAdornment: <SearchIcon sx={{ mr: 1 }} />,
          }}
          sx={{ width: 300 }}
        />
        {/* permission control wrapping */}
        {hasPermission(`${prefix}:create`) && (
          <Button
            startIcon={<AddIcon />}
            variant="contained"
            onClick={() => {
              setCurrentChapter(null);
              setOpenDialog(true);
            }}
          >
            Add Chapter
          </Button>
        )}
      </Box>

      <ChapterList
        loading={loading}
        columns={columns}
        pagedResult={pagedResult}
        page={filter.page - 1}
        pageSize={filter.pageSize}
        onPaginationModelChange={handlePaginationChange}
      />

      <AddUpdateChapterDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        data={currentChapter}
        onSave={handleSave}
        courseId={courseId}
      />

      <OperateConfirmationDialog
        open={confirmOpen}
        title="Confirm Delete"
        content="Are you sure you want to delete this chapter?"
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </Box>
  );
};

export default ChapterPage;
