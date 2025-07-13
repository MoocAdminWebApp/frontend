import React, {useRef} from "react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Grid,
} from "@mui/material";

import {Formik} from "formik";
import * as Yup from "yup";
import {CreateCourseOfferingDto, UpdateCourseOfferingDto} from "../../types/courseOffering";


interface AddUpdateDialogProps {
    open: boolean;
    onClose: ()=>void;
    data: UpdateCourseOfferingDto | null;
    onSave: (data:CreateCourseOfferingDto | UpdateCourseOfferingDto | null) => void;
}

const AddUpdateDialog: React.FC<AddUpdateDialogProps> = ({open,onClose,data,onSave,}) => {
    const formikRef=useRef<any>(null);

    const initialValues:CreateCourseOfferingDto & {id ?: number}={
        id: data?.id ?? 0,
        courseName: data?.courseName ?? "",
        teacherName: data?.teacherName ?? "",
        semester: data?.semester ?? "",
        location: data?.location ?? "",
        schedule: data?.schedule ?? "",
        status: data?.status ?? 0,
        courseId: data?.courseId ?? 0,
        capacity: data?.capacity ?? 0,
    };
    
    const validationSchema=Yup.object({
        courseName: Yup.string().required("Course name is required"),
        teacherName: Yup.string().required("Teacher name is required"),
        semester: Yup.string().required("Semester is required"),
        location: Yup.string().required("Location is required"),
        schedule: Yup.string().required("Schedule is required"),
        status: Yup.number().required("Status is required"),
        courseId: Yup.number().required("Course is required"),
        capacity: Yup.number().required("Capacity is required").min(1,"Capacity must be at least 1"),

    });





    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>{data ? "Edit Course Offering" : "Add Course Offering"}</DialogTitle>
            <Formik
              innerRef={formikRef}
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={(values) => {
                onSave(values);
              }}
            >
                {({values,handleChange,handleBlur,handleSubmit,touched,errors})=>(
                    <>
                        <DialogContent>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
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
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                     label="Teacher Name"
                                     name="teacherName"
                                     value={values.teacherName}
                                     onChange={handleChange}
                                     onBlur={handleBlur}
                                     error={touched.teacherName && Boolean(errors.teacherName)}
                                     helperText={touched.teacherName && errors.teacherName}
                                     fullWidth 
                                     />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                     label="Semester"
                                     name="semester"
                                     value={values.semester}
                                     onChange={handleChange}
                                     onBlur={handleBlur}
                                     error={touched.semester && Boolean(errors.semester)}
                                     helperText={touched.semester && errors.semester}
                                     fullWidth 
                                     />
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
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                     label="Schedule"
                                     name="schedule"
                                     value={values.schedule}
                                     onChange={handleChange}
                                     onBlur={handleBlur}
                                     error={touched.schedule && Boolean(errors.schedule)}
                                     helperText={touched.schedule && errors.schedule}
                                     fullWidth 
                                     />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                     label="Status"
                                     name="status"
                                     value={values.status}
                                     onChange={handleChange}
                                     onBlur={handleBlur}
                                     error={touched.status && Boolean(errors.status)}
                                     helperText={touched.status && errors.status}
                                     fullWidth 
                                     />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                     label="Course"
                                     name="courseId"
                                     value={values.courseId}
                                     onChange={handleChange}
                                     onBlur={handleBlur}
                                     error={touched.courseId && Boolean(errors.courseId)}
                                     helperText={touched.courseId && errors.courseId}
                                     fullWidth 
                                     />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                     label="Capacity"
                                     name="capacity"
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
                            <Button onClick={()=>handleSubmit()} variant="contained">
                                Save
                            </Button>
                        </DialogActions>
                    </>
                )}
             </Formik>
        </Dialog>
    )
};

export default AddUpdateDialog;