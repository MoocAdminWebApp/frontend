// pages/course/addUpdateCoursedialog.tsx
import React, { useRef } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  FormControlLabel,
  Switch,
  Box,
} from "@mui/material";
import { Formik } from "formik";
import * as Yup from "yup";

interface Instructor {
  id: number;
  name: string;
}

export interface Course {
  id?: number;
  title: string;
  description: string;
  status: "draft" | "published";
  instructor: Instructor | null;
  active: boolean;
}

interface AddUpdateCourseDialogProps {
  open: boolean;
  onClose: () => void;
  course: Course | null;
  onSave: (course: Course | null) => void;
}

const validationSchema = Yup.object({
  title: Yup.string().required("Title is required"),
  description: Yup.string().required("Description is required"),
  status: Yup.string()
    .oneOf(["draft", "published"])
    .required("Status is required"),
  instructor: Yup.object()
    .shape({
      id: Yup.number().required(),
      name: Yup.string().required(),
    })
    .nullable()
    .required("Instructor is required"),
});

const instructorsMock: Instructor[] = [
  { id: 101, name: "Alice" },
  { id: 102, name: "Bob" },
  { id: 103, name: "Carol" },
];

const AddUpdateCourseDialog: React.FC<AddUpdateCoursedialogProps> = ({
  open,
  onClose,
  course,
  onSave,
}) => {
  const formikRef = useRef<any>(null);

  const initialValues: Course = {
    id: course?.id,
    title: course?.title || "",
    description: course?.description || "",
    status: course?.status || "draft",
    instructor: course?.instructor || null,
    active: course?.active ?? true,
  };

  const handleSubmit = (values: Course) => {
    onSave(values);
  };

  const handleSaveClick = () => {
    if (formikRef.current) {
      formikRef.current.submitForm();
    }
  };

  const handleClose = (
    event: React.SyntheticEvent<{}>,
    reason: string
  ) => {
    if (reason !== "backdropClick") {
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{course ? "Edit Course" : "Add Course"}</DialogTitle>
      <DialogContent>
        <Formik
          innerRef={formikRef}
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            setFieldValue,
          }) => (
            <Box
              component="form"
              noValidate
              sx={{ mt: 1 }}
              onSubmit={(e) => {
                e.preventDefault();
                formikRef.current.submitForm();
              }}
            >
              <TextField
                margin="normal"
                fullWidth
                id="title"
                name="title"
                label="Title"
                value={values.title}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.title && Boolean(errors.title)}
                helperText={touched.title && errors.title}
              />

              <TextField
                margin="normal"
                fullWidth
                multiline
                minRows={3}
                id="description"
                name="description"
                label="Description"
                value={values.description}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.description && Boolean(errors.description)}
                helperText={touched.description && errors.description}
              />

              <TextField
                select
                margin="normal"
                fullWidth
                id="status"
                name="status"
                label="Status"
                value={values.status}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.status && Boolean(errors.status)}
                helperText={touched.status && errors.status}
                SelectProps={{ native: true }}
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </TextField>

              <TextField
                select
                margin="normal"
                fullWidth
                id="instructor"
                name="instructor"
                label="Instructor"
                value={values.instructor?.id || ""}
                onChange={(e) => {
                  const inst = instructorsMock.find(
                    (i) => i.id === Number(e.target.value)
                  );
                  setFieldValue("instructor", inst || null);
                }}
                onBlur={handleBlur}
                error={touched.instructor && Boolean(errors.instructor)}
                helperText={touched.instructor && (errors.instructor as any)}
                SelectProps={{ native: true }}
              >
                <option value="">Select Instructor</option>
                {instructorsMock.map((inst) => (
                  <option key={inst.id} value={inst.id}>
                    {inst.name}
                  </option>
                ))}
              </TextField>

              <FormControlLabel
                control={
                  <Switch
                    checked={values.active}
                    onChange={(e) => setFieldValue("active", e.target.checked)}
                    name="active"
                    color="primary"
                  />
                }
                label={values.active ? "Active" : "Inactive"}
                sx={{ mt: 2 }}
              />
            </Box>
          )}
        </Formik>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSaveClick}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddUpdateCourseDialog;
