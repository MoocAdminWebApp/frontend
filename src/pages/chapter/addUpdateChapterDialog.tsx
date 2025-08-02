import React, { useRef } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Grid,
  MenuItem,
} from "@mui/material";

import { Formik } from "formik";
import * as Yup from "yup";

export interface ChapterDto {
  id?: number;
  chapterNumber: number;
  courseId: number;
  title: string;
  description?: string | null;
  orderNum: number;
  status: "DRAFT" | "PUBLISHED" | "HIDDEN";
  content?: string | null;
  videoUrl?: string | null;
  duration?: number | null;
}

interface AddUpdateChapterDialogProps {
  open: boolean;
  onClose: () => void;
  data: ChapterDto | null;
  onSave: (data: ChapterDto) => void;
  courseId: number;
}

function renderHelperText(error: any) {
  if (!error) return "";
  if (typeof error === "string") return error;
  if (typeof error === "object") return JSON.stringify(error);
  return String(error);
}
const statusOptions = [
  { value: "DRAFT", label: "Draft" },
  { value: "PUBLISHED", label: "Published" },
  { value: "HIDDEN", label: "Hidden" },
];

const AddUpdateChapterDialog: React.FC<AddUpdateChapterDialogProps> = ({
  open,
  onClose,
  data,
  onSave,
  courseId,
}) => {
  const formikRef = useRef<any>(null);

  const initialValues: ChapterDto = {
    id: data?.id,
    chapterNumber: data?.chapterNumber ?? 1,
    courseId: data?.courseId ?? courseId,
    title: data?.title ?? "",
    description: data?.description ?? "",
    orderNum: data?.orderNum ?? 0,
    status: data?.status ?? "DRAFT",
    content: data?.content ?? "",
    videoUrl: data?.videoUrl ?? "",
    duration: data?.duration ?? undefined,
  };

  const validationSchema = Yup.object({
    chapterNumber: Yup.number()
      .required("Chapter number is required")
      .min(1, "Must be at least 1"),
    title: Yup.string().required("Title is required"),
    description: Yup.string(),
    orderNum: Yup.number().required("Order number is required"),
    status: Yup.string()
      .oneOf(["DRAFT", "PUBLISHED", "HIDDEN"])
      .required("Status is required"),
    content: Yup.string(),
    videoUrl: Yup.string().url("Must be a valid URL").nullable(),
    duration: Yup.number()
      .min(0, "Duration cannot be negative")
      .nullable(),
  });

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{data ? "Edit Chapter" : "Add Chapter"}</DialogTitle>
      <Formik
        innerRef={formikRef}
        initialValues={initialValues}
        validationSchema={validationSchema}
        enableReinitialize={true}
        onSubmit={(values) => {
          onSave({
            ...values,
          courseId: values.courseId ?? courseId,
          });
        }}
      >
        {({
          values,
          handleChange,
          handleBlur,
          handleSubmit,
          touched,
          errors,
        }) => {
    return (
          
          <>
            <DialogContent>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Chapter Number"
                    name="chapterNumber"
                    type="number"
                    value={values.chapterNumber}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.chapterNumber && Boolean(errors.chapterNumber)}
                    helperText={touched.chapterNumber && renderHelperText(errors.chapterNumber)}
                    fullWidth
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Title"
                    name="title"
                    value={values.title}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.title && Boolean(errors.title)}
                    helperText={touched.title && renderHelperText(errors.title)}
                    fullWidth
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    label="Description"
                    name="description"
                    multiline
                    minRows={3}
                    value={values.description ?? ""}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.description && Boolean(errors.description)}
                    helperText={touched.description && renderHelperText(errors.description)}
                    fullWidth
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Order Number"
                    name="orderNum"
                    type="number"
                    value={values.orderNum}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.orderNum && Boolean(errors.orderNum)}
                    helperText={touched.orderNum && renderHelperText(errors.orderNum)}
                    fullWidth
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    select
                    label="Status"
                    name="status"
                    value={values.status}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.status && Boolean(errors.status)}
                    helperText={touched.status && renderHelperText(errors.status)}
                    fullWidth
                  >
                    {statusOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    label="Content"
                    name="content"
                    multiline
                    minRows={4}
                    value={values.content ?? ""}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.content && Boolean(errors.content)}
                    helperText={touched.content && renderHelperText(errors.content)}
                    fullWidth
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    label="Video URL"
                    name="videoUrl"
                    value={values.videoUrl ?? ""}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.videoUrl && Boolean(errors.videoUrl)}
                    helperText={touched.videoUrl && renderHelperText(errors.videoUrl)}
                    fullWidth
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Duration (seconds)"
                    name="duration"
                    type="number"
                    value={values.duration ?? ""}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.duration && Boolean(errors.duration)}
                    helperText={touched.duration && renderHelperText(errors.duration)}
                    fullWidth
                  />
                </Grid>
              </Grid>
            </DialogContent>

            <DialogActions>
              <Button onClick={onClose}>Cancel</Button>
              <Button onClick={() => handleSubmit()} variant="contained">
                Save
              </Button>
            </DialogActions>
          </>
        )}}
      </Formik>
    </Dialog>
  );
};

export default AddUpdateChapterDialog;
