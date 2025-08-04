import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Grid,
  MenuItem,
  Box,
  Typography,
} from "@mui/material";
import { Formik, FormikErrors } from "formik";
import * as Yup from "yup";
import { CreateCourseOfferingDto, UpdateCourseOfferingDto, CourseOfferingFormValues } from "../../types/courseOffering";
import { get } from "../../request/axios";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateRangePicker } from "@mui/x-date-pickers-pro/DateRangePicker";
import { Dayjs } from "dayjs";
import dayjs from "dayjs";
import "dayjs/locale/en-au";
import { AnyAaaaRecord } from "node:dns";


export const statusOptions = [
    { value: 0, label: "open" },
    { value: 1, label: "closed" },
     { value: 2, label: "canceled" },
   ];



interface Course {
  id: number;
  courseCode: string;
  courseName: string;
}

interface AddUpdateDialogProps {
  open: boolean;
  onClose: () => void;
  data: UpdateCourseOfferingDto | null;
  onSave: (data:any) => void;
}

const AddUpdateDialog: React.FC<AddUpdateDialogProps> = ({ open, onClose, data, onSave }) => {
  const formikRef = useRef<any>(null);

  const semesterOptions = [
    { id: 0, name: "2026 First" },
    { id: 1, name: "2026 Second" },
  ];

  const [courseOptions, setCourseOptions] = useState<{ id:number;courseCode: string; courseName: string }[]>([]);
  const [teacherOptions, setTeacherOptions] = useState<{ id: number; name: string }[]>([]);

  const parseSchedule = (raw: string | undefined): [Dayjs | null, Dayjs | null] => {
  if (!raw) return [null, null];
  const parts = raw.split("-");
  const start = dayjs(parts[0], "D/M/YYYY");
  const end = dayjs(parts[1], "D/M/YYYY");
  return [start.isValid() ? start : null, end.isValid() ? end : null];
};


  const initialValues: CourseOfferingFormValues = {
    id: data?.id ?? 0,
    courseId: data?.courseId ?? "",
    courseCode: data?.courseCode ?? "",
    courseName: data?.courseName ?? "",
    teacherName: data?.teacherName ?? "",
    semester: data?.semester ?? "",
    location: data?.location ?? "",
    schedule: parseSchedule(data?.schedule),
    status: data?.status ?? "",
    capacity: data?.capacity ?? 0,
  };

  const validationSchema = Yup.object({
    courseId: Yup.number().required("Course is required"),
    courseName: Yup.string().required("Course name is required"),
    teacherName: Yup.string().required("Teacher name is required"),
    semester: Yup.string().required("Semester is required"),
    location: Yup.string().required("Location is required"),
    schedule: Yup.array()
      .of(Yup.mixed().nullable())
      .required("Schedule is required")
      .test("both-dates", "Schedule must have start and end dates", (value) => {
        return !!(value && value[0] && value[1]);
      }),
    status: Yup.mixed().required("Status is required"),
    capacity: Yup.number().required("Capacity is required").min(1, "Capacity must be at least 1"),
  });

  useEffect(() => {
    const loadCourses = async () => {
  const resp = await get<{ data: Course[] }>("/courses");
  console.log("resp", resp);

  if (resp.isSuccess && Array.isArray(resp.data?.data)) {
    setCourseOptions(
      resp.data.data.map((c) => ({
        id: c.id,
        courseCode: c.courseCode,
        courseName: c.courseName,
      }))
    );
  }
};

    const loadTeachers = async () => {
      const resp = await get<any[]>("/users");
      if (resp.isSuccess && resp.data) {
        const teachers = resp.data
          .filter((u) => u.access === "TEACHER")
          .map((u) => ({ id: u.id, name: `${u.firstName} ${u.lastName}` }));
        setTeacherOptions(teachers);
      }
    };

    loadCourses();
    loadTeachers();
  }, []);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{data ? "Edit Course Offering" : "Add Course Offering"}</DialogTitle>
      <Formik<CourseOfferingFormValues>
        innerRef={formikRef}
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          const transformed: CreateCourseOfferingDto | UpdateCourseOfferingDto = {
            ...values,
            schedule:
              values.schedule && values.schedule[0] && values.schedule[1]
                ? `${values.schedule[0].format("D/M/YYYY")}-${values.schedule[1].format("D/M/YYYY")}`
                : "",
          };
          onSave(transformed);
        }}
      >
        {({ values, handleChange, handleBlur, handleSubmit, touched, errors, setFieldValue }) => (
          <>
            <DialogContent>
              <Grid container spacing={2}>
                {/* Course */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    select
                    label="Course"
                    name="courseName"
                    value={values.courseName}
                    onChange={(e) => {
                        const selectedCourse = courseOptions.find(
                          (c) => c.courseName === e.target.value
                        );
                     setFieldValue("courseName", e.target.value);
                     setFieldValue("courseCode", selectedCourse?.courseCode ?? "");
                     setFieldValue("courseId", selectedCourse?.id ?? ""); 
                     }}
                    onBlur={handleBlur}
                    error={touched.courseId && Boolean(errors.courseId)}
                    helperText={touched.courseId && errors.courseId}
                    fullWidth
                  >
                    {courseOptions.map((course) => (
                      <MenuItem key={course.courseCode} value={course.courseName}>
                        {course.courseName}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                {/* Teacher */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    select
                    label="Teacher"
                    name="teacherName"
                    value={values.teacherName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.teacherName && Boolean(errors.teacherName)}
                    helperText={touched.teacherName && errors.teacherName}
                    fullWidth
                  >
                    {teacherOptions.map((teacher) => (
                      <MenuItem key={teacher.id} value={teacher.name}>
                        {teacher.name}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                {/* Semester + Location */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    select
                    label="Semester"
                    name="semester"
                    value={values.semester}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.semester && Boolean(errors.semester)}
                    helperText={touched.semester && errors.semester}
                    fullWidth
                  >
                    {semesterOptions.map((s) => (
                      <MenuItem key={s.id} value={s.name}>
                        {s.name}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Location"
                    name="location"
                    value={values.location}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.location && Boolean(errors.location)}
                    helperText={touched.location && errors.location}
                    fullWidth
                  />
                </Grid>

                {/* Schedule */}
                <Grid item xs={12} sm={6}>
                  <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en-au">
                    <DateRangePicker
                      value={values.schedule}
                      onChange={(newValue) => setFieldValue("schedule", newValue as [Dayjs | null, Dayjs | null])}
                      localeText={{ start: "Start date", end: "End date" }}
                      slotProps={{
                        textField: { fullWidth: true },
                      }}
                    />
                    {touched.schedule && errors.schedule && (
                      <Typography variant="caption" color="error">
                        {errors.schedule as string}
                      </Typography>
                    )}
                  </LocalizationProvider>
                </Grid>

                {/* Status + Capacity */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    select
                    label="Status"
                    name="status"
                    value={values.status}
                    onChange={(e) => setFieldValue("status", e.target.value)}
                    onBlur={handleBlur}
                    error={touched.status && Boolean(errors.status)}
                    helperText={touched.status && errors.status}
                    fullWidth
                  >
                    <MenuItem value="" disabled>
                      <em>Status</em>
                    </MenuItem>
                    {statusOptions.map((s) => (
                      <MenuItem key={s.value} value={s.value}>
                        {s.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Capacity"
                    name="capacity"
                    type="number"
                    value={values.capacity}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.capacity && Boolean(errors.capacity)}
                    helperText={touched.capacity && errors.capacity}
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
        )}
      </Formik>
    </Dialog>
  );
};

export default AddUpdateDialog;
