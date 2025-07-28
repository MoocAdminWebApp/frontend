import { useRef } from "react";
import { CreateMenuDto, UpdateMenuDto } from "../../types/menu";
import * as Yup from "yup";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { Formik } from "formik";
import { MenuType, StatusType } from "../../types/enum";

//Umenuser pop-up component Prop
interface AddUpdateDialogProps {
  open: boolean;
  onClose: () => void;
  menu: UpdateMenuDto | null;
  onSave: (user: CreateMenuDto | UpdateMenuDto | null) => void;
}

const AddUpdateDialog: React.FC<AddUpdateDialogProps> = ({
  open,
  onClose,
  menu,
  onSave,
}) => {
  //const isEdit = menu != null;
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
    id: menu ? menu.id : 0,
    title: menu ? menu.title : "",
    comment: menu ? menu.comment : "",
    menuType: menu ? menu.menuType : MenuType.Menu,
    parentId: menu ? menu.parentId : null,
    orderNum: menu ? menu.orderNum : 0,
    route: menu ? menu.route : "",
    componentPath: menu ? menu.componentPath : "",
    permission: menu ? menu.permission : null,
    status: menu ? menu.status : StatusType.Active,
  };

  const formikRef = useRef<any>(null); //  formikRef
  const handleSubmit = (values: UpdateMenuDto) => {
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
      <DialogTitle>{menu ? "Edit Menu" : "Add Menu"}</DialogTitle>
      <Typography sx={{ color: "#ff0000" }}>TO BE FIXED</Typography>
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
                name="comment"
                label="comment"
                value={values.comment}
                onChange={handleChange}
                onBlur={handleBlur}
                fullWidth
                margin="normal"
                variant="outlined"
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
