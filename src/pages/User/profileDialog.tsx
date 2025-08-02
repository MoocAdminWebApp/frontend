import { useRef } from "react";
import { CreateProfileDto, UpdateProfileDto } from "../../types/profile";
import * as Yup from "yup";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  MenuItem,
} from "@mui/material";
import { Formik } from "formik";
import { EGenderType } from "../../types/enum";

// Props
interface ProfileInfoDialogProps {
  open: boolean;
  onClose: () => void;
  profile: UpdateProfileDto | null;
  onSave: (profile: CreateProfileDto | UpdateProfileDto) => void;
}

// Gender Options
const genderOptions = [
  { value: "MALE", label: "Male" },
  { value: "FEMALE", label: "Female" },
  { value: "OTHER", label: "Other" },
  { value: "PREFER_NOT_TO_SAY", label: "Prefer Not to Say" },
];

const ProfileInfoDialog: React.FC<ProfileInfoDialogProps> = ({
  open,
  onClose,
  profile,
  onSave,
}) => {
  const validationSchema = Yup.object({
    countryCode: Yup.string().max(5),
    phoneNumber: Yup.string().max(20),
    country: Yup.string().max(100),
    state: Yup.string().max(100),
    city: Yup.string().max(100),
    streetAddress: Yup.string().max(255),
    postalCode: Yup.string().max(20),
    birthdate: Yup.date().nullable(),
    gender: Yup.mixed().oneOf(
      ["MALE", "FEMALE", "OTHER", "PREFER_NOT_TO_SAY"],
      "Invalid gender"
    ),
    avatar: Yup.string().url("Must be a valid URL").nullable(),
    bio: Yup.string().max(500),
  });

  const initialValues: CreateProfileDto | UpdateProfileDto = {
    id: profile ? profile.id : 0,
    countryCode: profile?.countryCode || "",
    phoneNumber: profile?.phoneNumber || "",
    country: profile?.country || "",
    state: profile?.state || "",
    city: profile?.city || "",
    streetAddress: profile?.streetAddress || "",
    postalCode: profile?.postalCode || "",
    birthdate: profile?.birthdate || "",
    gender: profile?.gender || EGenderType.PREFER_NOT_TO_SAY,
    avatar: profile?.avatar || "",
    bio: profile?.bio || "",
  };

  const formikRef = useRef<any>(null);

  const handleSubmit = (values: CreateProfileDto | UpdateProfileDto) => {
    onSave(values);
  };

  const btnSave = () => {
    if (formikRef.current) {
      formikRef.current.submitForm();
    }
  };

  const handleClose = (event: React.SyntheticEvent<{}>, reason: string) => {
    if (reason !== "backdropClick") {
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>
        {profile ? "Edit Profile Info" : "Add Profile Info"}
      </DialogTitle>
      <DialogContent>
        <Formik
          innerRef={formikRef}
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, handleChange, handleBlur, touched, errors }) => (
            <form>
              <TextField
                name="countryCode"
                label="Country Code"
                value={values.countryCode}
                onChange={handleChange}
                onBlur={handleBlur}
                fullWidth
                margin="normal"
                error={touched.countryCode && Boolean(errors.countryCode)}
                helperText={touched.countryCode && errors.countryCode}
              />
              <TextField
                name="phoneNumber"
                label="Phone Number"
                value={values.phoneNumber}
                onChange={handleChange}
                onBlur={handleBlur}
                fullWidth
                margin="normal"
                error={touched.phoneNumber && Boolean(errors.phoneNumber)}
                helperText={touched.phoneNumber && errors.phoneNumber}
              />
              <TextField
                name="country"
                label="Country"
                value={values.country}
                onChange={handleChange}
                onBlur={handleBlur}
                fullWidth
                margin="normal"
              />
              <TextField
                name="state"
                label="State"
                value={values.state}
                onChange={handleChange}
                onBlur={handleBlur}
                fullWidth
                margin="normal"
              />
              <TextField
                name="city"
                label="City"
                value={values.city}
                onChange={handleChange}
                onBlur={handleBlur}
                fullWidth
                margin="normal"
              />
              <TextField
                name="streetAddress"
                label="Street Address"
                value={values.streetAddress}
                onChange={handleChange}
                onBlur={handleBlur}
                fullWidth
                margin="normal"
              />
              <TextField
                name="postalCode"
                label="Postal Code"
                value={values.postalCode}
                onChange={handleChange}
                onBlur={handleBlur}
                fullWidth
                margin="normal"
              />
              <TextField
                name="birthdate"
                label="Birthdate"
                type="date"
                value={values.birthdate}
                onChange={handleChange}
                onBlur={handleBlur}
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                name="gender"
                label="Gender"
                value={values.gender}
                onChange={handleChange}
                onBlur={handleBlur}
                select
                fullWidth
                margin="normal"
                error={touched.gender && Boolean(errors.gender)}
                helperText={touched.gender && errors.gender}
              >
                {genderOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                name="avatar"
                label="Avatar URL"
                value={values.avatar}
                onChange={handleChange}
                onBlur={handleBlur}
                fullWidth
                margin="normal"
              />
              <TextField
                name="bio"
                label="Bio"
                value={values.bio}
                onChange={handleChange}
                onBlur={handleBlur}
                multiline
                rows={3}
                fullWidth
                margin="normal"
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

export default ProfileInfoDialog;
