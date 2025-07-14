import { useRef } from "react";
import { CreateDemoDto, UpdateDemoDto } from "../../types/demo";
import * as Yup from "yup";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormControlLabel, Switch, TextField } from "@mui/material";
import { Formik } from "formik";

//Udemoser pop-up component Prop
interface AddUpdateDialogProps {
  open: boolean;
  onClose: () => void;
  demo: UpdateDemoDto | null;
  onSave: (user: CreateDemoDto | UpdateDemoDto | null) => void;
}


const AddUpdateDialog: React.FC<AddUpdateDialogProps> = ({
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


export default AddUpdateDialog;