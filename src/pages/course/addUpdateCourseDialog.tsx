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
import { CreateCourseDto, UpdateCourseDto } from "../../types/course";

interface AddUpdateCourseDialogProps {
  open: boolean;
  onClose: () => void;
  data: UpdateCourseDto | null;
  onSave: (data: CreateCourseDto | UpdateCourseDto | null) => void;
}

const statusOptions = [
  { value: "DRAFT", label: "Draft" },
  { value: "PUBLISHED", label: "Published" },
  { value: "ARCHIVED", label: "Archived" },
];

const AddUpdateCourseDialog: React.FC<AddUpdateCourseDialogProps> = ({
  open,
  onClose,
  data,
  onSave,
}) => {
  const formikRef = useRef<any>(null);

  const initialValues: CreateCourseDto & { id?: number } = {
    id: data?.id ?? 0,
    courseName: data?.courseName ?? "",
    courseDescription: data?.courseDescription ?? "",
    instructorId: data?.instructorId ?? 0,
    status: data?.status ?? "DRAFT",
  };

  const validationSchema = Yup.object({
    courseName: Yup.string().required("Course name is required"),
    courseDescription: Yup.string(),
    instructorId: Yup.number()
      .required("Instructor is required")
      .min(1, "Please select an instructor"),
    status: Yup.string()
      .oneOf(["DRAFT", "PUBLISHED", "ARCHIVED"])
      .required("Status is required"),
  });

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{data ? "Edit Course" : "Add Course"}</DialogTitle>
      <Formik
        innerRef={formikRef}
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          onSave(values);
        }}
      >
        {({
          values,
          handleChange,
          handleBlur,
          handleSubmit,
          touched,
          errors,
        }) => (
          <>
            <DialogContent>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    label="Course Name"
                    name="courseName"
                    value={values.courseName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.courseName && Boolean(errors.courseName)}
                    helperText={
  touched.courseName && typeof errors.courseName === "string"
    ? errors.courseName
    : ""
}
                    fullWidth
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    label="Course Description"
                    name="courseDescription"
                    value={values.courseDescription}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={
                      touched.courseDescription &&
                      Boolean(errors.courseDescription)
                    }
                    helperText={
  touched.courseDescription && typeof errors.courseDescription === "string"
    ? errors.courseDescription
    : ""
}
                    fullWidth
                    multiline
                    rows={3}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    select
                    label="Instructor"
                    name="instructorId"
                    value={values.instructorId}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.instructorId && Boolean(errors.instructorId)}
helperText={
  touched.instructorId &&
  typeof errors.instructorId === "string"
    ? errors.instructorId
    : typeof errors.instructorId === "object" && "msg" in errors.instructorId
    ? errors.instructorId
    : ""
}
                    fullWidth
                  >
                    {/* 这里你需要替换成你的真实教师数据 */}
                    <MenuItem value={0}>Select Instructor</MenuItem>
                    <MenuItem value={1}>Alice</MenuItem>
                    <MenuItem value={2}>Bob</MenuItem>
                    <MenuItem value={3}>Carol</MenuItem>
                  </TextField>
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
                    helperText={
  touched.status && typeof errors.status === "string"
    ? errors.status
    : ""
}
                    fullWidth
                  >
                    {statusOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
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
        )}
      </Formik>
    </Dialog>
  );
};

export default AddUpdateCourseDialog;
