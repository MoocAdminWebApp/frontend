import React, { useEffect } from "react";
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
  data: UpdateCourseDto | null; // 编辑时传入，不编辑时传null
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
  // 这里用 useEffect 保证 data 改变时 formik 重置值
  const initialValues: CreateCourseDto & { id?: number } = {
    id: data?.id,
    courseName: data?.courseName || "",
    courseDescription: data?.courseDescription || "",
    courseCode: data?.courseCode || "",
    instructorId: data?.instructorId || 0,
    status: data?.status || "DRAFT",
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{data ? "Edit Course" : "Add Course"}</DialogTitle>
      <Formik
        enableReinitialize // 关键！data变了才重置表单数据
        initialValues={initialValues}
        validationSchema={Yup.object({
          courseName: Yup.string().required("Course name is required"),
          courseCode: Yup.string().required("Course code is required"),
          instructorId: Yup.number()
            .required("Instructor is required")
            .min(1, "Please select an instructor"),
          status: Yup.string()
            .oneOf(["DRAFT", "PUBLISHED", "ARCHIVED"])
            .required("Status is required"),
        })}
        onSubmit={(values) => onSave(values)}
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
                    helperText={touched.courseName && errors.courseName}
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
                    helperText={touched.courseDescription && errors.courseDescription}
                    fullWidth
                    multiline
                    minRows={2}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Course Code"
                    name="courseCode"
                    value={values.courseCode}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.courseCode && Boolean(errors.courseCode)}
                    helperText={touched.courseCode && errors.courseCode}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Instructor ID"
                    name="instructorId"
                    type="number"
                    value={values.instructorId}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.instructorId && Boolean(errors.instructorId)}
                    helperText={touched.instructorId && errors.instructorId}
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
                    helperText={touched.status && errors.status}
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
              <Button variant="contained" onClick={() => handleSubmit()}>
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
