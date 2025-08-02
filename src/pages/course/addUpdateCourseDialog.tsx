import React from "react";
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
  onSave: (data: CreateCourseDto | UpdateCourseDto) => void;
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
  console.log("Dialog data prop:", data?.courseCode);
 const initialValues = {
  id: data?.id ?? 0,
  courseName: data?.courseName || "",
  courseDescription: data?.courseDescription || "",
  courseCode: data?.courseCode || "",
  instructorId: data?.instructorId || 0,
  status: data?.status || "DRAFT",
};

  const validationSchema = Yup.object({
    courseName: Yup.string().required("Course name is required"),
    courseCode: Yup.string().required("Course code is required"),
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
        enableReinitialize
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSave}
      >
        {({
          values,
          handleChange,
          handleBlur,
          handleSubmit,
          touched,
          errors,
        }) => {
           console.log("Formik initialValues:",initialValues);
          return(
          <form onSubmit={handleSubmit} noValidate>
            <DialogContent>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    label="Course Name"
                    name="courseName"
                    fullWidth
                    value={values.courseName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.courseName && Boolean(errors.courseName)}
                    helperText={touched.courseName && errors.courseName}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Course Description"
                    name="courseDescription"
                    fullWidth
                    multiline
                    minRows={2}
                    value={values.courseDescription}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={
                      touched.courseDescription &&
                      Boolean(errors.courseDescription)
                    }
                    helperText={
                      touched.courseDescription && errors.courseDescription
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Course Code"
                    name="courseCode"
                    fullWidth
                    value={values.courseCode}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.courseCode && Boolean(errors.courseCode)}
                    helperText={touched.courseCode && errors.courseCode}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Instructor ID"
                    name="instructorId"
                    type="number"
                    fullWidth
                    value={values.instructorId}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={
                      touched.instructorId && Boolean(errors.instructorId)
                    }
                    helperText={touched.instructorId && errors.instructorId}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    select
                    label="Status"
                    name="status"
                    fullWidth
                    value={values.status}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.status && Boolean(errors.status)}
                    helperText={touched.status && errors.status}
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
              <Button type="submit" variant="contained" color="primary">
                Save
              </Button>
            </DialogActions>
          </form>
        )}}
      </Formik>
    </Dialog>
  );
};

export default AddUpdateCourseDialog;
