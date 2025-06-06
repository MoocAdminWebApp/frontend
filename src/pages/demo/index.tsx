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
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import * as Yup from "yup";
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

const Demos: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentDemo, setCurrentDemo] = useState<UpdateDemoDto | null>(null);
  const [searchText, setSearchText] = useState("");

  const searchQuery = useDebounce(searchText, 500); //use Debounce Hook
  useEffect(() => {
    setFilterPagedResultRequest((pre) => ({ ...pre, filter: searchQuery }));
  }, [searchQuery]);

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
  const handleSaveUser = async (demo: CreateDemoDto | UpdateDemoDto | null) => {
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

  //Table Column Definition
  const columns: GridColDef[] = [
    // { field: 'id', headerName: 'ID', width: 90, },
    { field: "title", headerName: "Title", width: 180 },
    { field: "mark", headerName: "Mark", width: 220 },
    { field: "count", headerName: "Count", width: 100 },
    {
      field: "acitve",
      headerName: "Acitve",
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
              <Tooltip title="Acitve">
                <CheckCircleIcon color="success" fontSize="small" />
              </Tooltip>
            ) : (
              <Tooltip title="not active">
                <CancelIcon color="error" fontSize="small" />
              </Tooltip>
            )}
            <Typography variant="body2">
              {params.value ? "Acitve" : "not active"}
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
          <PermissionControl permission="">
            <IconButton onClick={() => handleUpdate(params.row as DemoDto)}>
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

  const [comfirmDialogOpen, setComfirmDialogOpen] = useState(false);
  const [deData, setDelData] = useState(0);
  const handleDelete = async (id: GridRowId) => {
    setDelData(id as number);
    setComfirmDialogOpen(true);
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

        <Button
          disabled={loading}
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog(null)}
        >
          Add Demo
        </Button>
      </Box>
      <DemoList
        loading={loading}
        columns={columns}
        pagedResult={pageData}
        page={filterPagedResultRequest.page - 1}
        pageSize={filterPagedResultRequest.pageSize}
        onPaginationModelChange={onPaginationModelChange}
      />

      <UserDialog
        open={openDialog}
        onClose={handleCloseDialog}
        demo={currentDemo}
        onSave={handleSaveUser}
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

//Udemoser pop-up component Prop
interface DemoDialogProps {
  open: boolean;
  onClose: () => void;
  demo: UpdateDemoDto | null;
  onSave: (user: CreateDemoDto | UpdateDemoDto | null) => void;
}

const UserDialog: React.FC<DemoDialogProps> = ({
  open,
  onClose,
  demo,
  onSave,
}) => {
  //const isEdit = demo != null;
  const validationSchema = Yup.object({
    title: Yup.string().required("title is required"),
    acitve: Yup.boolean()
      .required("acitve is required")
      .transform((value) => {
        if (value === "true") return true;
        if (value === "false") return false;
        return value;
      }),
    dataTime: Yup.date().required("dataTime is required"),
  });

  const initialValues = {
    id: demo ? demo.id : 0,
    title: demo ? demo.title : "",
    mark: demo ? demo.mark : "",
    count: demo ? demo.count : 0,
    acitve: demo ? demo.acitve : false,
    dataTime: demo ? demo.dataTime : new Date(),
  };

  const formikRef = useRef<any>(null); //  formikRef
  const handleSubmit = (values: UpdateDemoDto) => {
    if (onSave) {
      onSave(values);
    }
    //console.log('Form values:', values);
  };

  const btnSave = () => {
    if (formikRef.current) {
      formikRef.current.submitForm(); //Manually trigger form submission
    }
  };

  //reason: DialogCloseReason
  const handleClose = (event: React.SyntheticEvent<{}>, reason: string) => {
    if (reason !== "backdropClick") {
      onClose();
    }
  };

  function toLocalISOString(date: Date) {
    // 1. Obtain local time for each part
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    // 2. Combine the format required for timestamp local
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{demo ? "Edit Demo" : "Add Demo"}</DialogTitle>
      <DialogContent>
        <Formik
          innerRef={formikRef}
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({
            values,
            handleChange,
            handleBlur,
            setFieldValue,
            errors,
            touched,
          }) => (
            <form>
              <TextField
                name="title"
                label="title"
                value={values.title}
                onChange={handleChange}
                onBlur={handleBlur}
                fullWidth
                margin="normal"
                variant="outlined"
                error={touched.title && Boolean(errors.title)}
                helperText={touched.title && errors.title}
              />

              <TextField
                name="mark"
                label="mark"
                value={values.mark}
                onChange={handleChange}
                onBlur={handleBlur}
                fullWidth
                margin="normal"
                variant="outlined"
              />

              <TextField
                name="count"
                label="count"
                value={values.count}
                onChange={handleChange}
                onBlur={handleBlur}
                fullWidth
                margin="normal"
                variant="outlined"
                type="number"
              />

              {/* <TextField
                                name="dataTime"
                                label="dataTime"
                                type="datetime"
                                value={values.dataTime}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                fullWidth
                                margin="normal"
                                variant="outlined"
                            /> */}

              <FormControl fullWidth margin="normal" variant="outlined">
                <TextField
                  name="dataTime"
                  label="Birthday"
                  type="datetime-local"
                  onBlur={handleBlur}
                  value={toLocalISOString(values.dataTime)}
                  onChange={(e) => {
                    const date = e.target.value
                      ? new Date(e.target.value)
                      : null;
                    setFieldValue("dataTime", date);
                  }}
                />
              </FormControl>

              <FormControlLabel
                control={
                  <Switch
                    name="acitve"
                    checked={values.acitve}
                    onChange={handleChange}
                    color="primary"
                  />
                }
                label={values.acitve ? "acitve" : "not acitve"}
                labelPlacement="end"
              />
            </form>
          )}
        </Formik>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={btnSave} variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Demos;
