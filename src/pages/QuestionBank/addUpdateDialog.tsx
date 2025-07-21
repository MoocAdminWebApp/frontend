import { useRef } from "react";
import { CreateQuestionDto, UpdateQuestionDto } from "../../types/question";
import * as Yup from "yup";
import { Button, 
        Dialog, 
        DialogActions, 
        DialogContent, 
        DialogTitle, 
        FormControl, 
        FormControlLabel, 
        Switch, 
        TextField,
        InputLabel,
        Select,
        MenuItem,
        FormHelperText,
        Box,
        Typography
        } from "@mui/material";
import { Formik, Form } from "formik";

//User pop-up component Prop
interface AddUpdateDialogProps {
  open: boolean;
  onClose: () => void;
  question: UpdateQuestionDto | null;
  onSave: (user: CreateQuestionDto | UpdateQuestionDto | null) => void;
}


const AddUpdateDialog: React.FC<AddUpdateDialogProps> = ({
  open,
  onClose,
  question,
  onSave,
}) => {
  //const isEdit = question != null;
  const validationSchema = Yup.object({
    category: Yup.string().required("category is required"),
    content: Yup.string().required("content is required"),
    type: Yup.string().oneOf(["Single", "Multiple", "ShortAnswer", "TrueFalse"]).required("type is required"),
    difficulty: Yup.string().oneOf(["Easy", "Medium", "Hard"]).required("difficulty is required"),
    dataTime: Yup.date().notRequired(),
  });

  const initialValues = {
    id: question ? question.id : 0,
    category: question ? question.category : "",
    type: question ? question.type : "Single",
    content: question ? question.content : "",
    difficulty: question ? question.difficulty : "Easy",
    options: question ? question.options : [],
    dataTime: question ? question.dataTime : new Date(),
  };

  const formikRef = useRef<any>(null); //  formikRef
  const handleSubmit = (values: UpdateQuestionDto) => {
    const updatedValues = {
      ...values,
      dataTime: new Date(),
    };
    console.log("Submitting with values:", values);
    if (onSave) {
      onSave(updatedValues);
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

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{question ? "Edit Question" : "Add Question"}</DialogTitle>
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
            <Form>
              <TextField
                name="category"
                label="Category"
                value={values.category}
                onChange={handleChange}
                onBlur={handleBlur}
                fullWidth
                margin="normal"
                variant="outlined"
                error={touched.category && Boolean(errors.category)}
                helperText={touched.category && errors.category}
              />

              <TextField
                name="content"
                label="Question Content"
                value={values.content}
                onChange={handleChange}
                onBlur={handleBlur}
                fullWidth
                margin="normal"
                variant="outlined"
                error={touched.content && Boolean(errors.content)}
                helperText={touched.content && errors.content}
              />

              <FormControl fullWidth margin="normal" variant="outlined">
                <InputLabel>Type</InputLabel>
                <Select
                  name="type"
                  value={values.type}
                  onChange={handleChange}
                  label="Type"
                  error={touched.type && Boolean(errors.type)}
                >
                  <MenuItem value="Single">Single</MenuItem>
                  <MenuItem value="Multiple">Multiple</MenuItem>
                  <MenuItem value="ShortAnswer">Short Answer</MenuItem>
                  <MenuItem value="TrueFalse">TrueFalse</MenuItem>
                </Select>
                {touched.type && errors.type && (
                  <FormHelperText error>{errors.type}</FormHelperText>
                )}
              </FormControl>

              <FormControl fullWidth margin="normal" variant="outlined">
                <InputLabel>Difficulty</InputLabel>
                <Select
                  name="difficulty"
                  value={values.difficulty}
                  onChange={handleChange}
                  label="Difficulty"
                  error={touched.difficulty && Boolean(errors.difficulty)}
                >
                  <MenuItem value="Easy">Easy</MenuItem>
                  <MenuItem value="Medium">Medium</MenuItem>
                  <MenuItem value="Hard">Hard</MenuItem>
                </Select>
                {touched.difficulty && errors.difficulty && (
                  <FormHelperText error>{errors.difficulty}</FormHelperText>
                )}
              </FormControl>

              {values.type !== "ShortAnswer" && (
                <>
                  <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
                    Options
                  </Typography>

                  {values.options.map((option, index) => (
                    <Box key={index} display="flex" alignItems="center" gap={2} mb={1}>
                      <TextField
                        label={`Option ${index + 1}`}
                        value={option.content}
                        onChange={(e) => {
                          const newOptions = [...values.options];
                          newOptions[index].content = e.target.value;
                          setFieldValue("options", newOptions);
                        }}
                        fullWidth
                      />
                      <FormControlLabel
                        control={
                          <Switch
                            checked={option.isCorrect}
                            onChange={(e) => {
                              const newOptions = [...values.options];
                              if (values.type === "Single") {
                                newOptions.forEach(opt => (opt.isCorrect = false));
                              }
                              newOptions[index].isCorrect = e.target.checked;
                              setFieldValue("options", newOptions);
                            }}
                          />
                        }
                        label="Correct"
                      />
                      <Button
                        color="error"
                        variant="outlined"
                        onClick={() => {
                          const newOptions = values.options.filter((_, i) => i !== index);
                          setFieldValue("options", newOptions);
                        }}
                      >
                        Remove
                      </Button>
                    </Box>
                  ))}

                  <Button
                    variant="outlined"
                    sx={{ mt: 1 }}
                    onClick={() =>
                      setFieldValue("options", [
                        ...values.options,
                        { content: "", isCorrect: false },
                      ])
                    }
                  >
                    Add Option
                  </Button>
                </>
              )}
            </Form>
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