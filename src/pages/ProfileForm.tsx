import React, { useState, useRef, useEffect } from 'react';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  FormHelperText,
  Grid,
  MenuItem,
  Select,
  TextField,
  Typography,
  useTheme,
 FormControl,
   InputLabel,
} from '@mui/material';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Gender } from '../types/enum';
import { get, post, put } from '../request/axios';
import toast from 'react-hot-toast';
import AvatarCrop from '../components/avatarCrop';
import { useDispatch, useSelector } from 'react-redux';
import { reSetAvatar } from '../store/authSlice';
import { ensureTrailingSlash, imageHttpUrlToBase64, isBase64DataURL } from '../utils/stringUtil';
//import 'cropperjs/dist/cropper.min.css';
import type { RootState } from "../store/store"; 
import { mapGenderStringToEnum, mapGenderEnumToString } from '../utils/mapGenderAndEnum';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import { useNavigate } from 'react-router-dom'; 


// Form Validation Rules
const validationSchema = Yup.object().shape({
  userId: Yup.number()
    .typeError("Invalid user ID")
    .required("User ID is required"),
  firstName: Yup.string()
    .required("First name is required")
    .max(50, "First name cannot exceed 50 characters"),
  lastName: Yup.string()
    .required("Last name is required")
    .max(50, "Last name cannot exceed 50 characters"),
  avatar: Yup.string()
    .nullable(),
  email: Yup.string()
    .email('Please enter a valid email address')
    .required('Email address cannot be empty'),
  phoneNumber: Yup.string()
    .required("Phone number is required")
    .matches(
      /^[0-9+\-() ]+$/,
      "Phone number format is invalid"
    ),
  birthdate: Yup.string()
    .required("Birthdate is required")
    .matches(
      /^\d{4}-\d{2}-\d{2}$/,
      "Birthdate must be in YYYY-MM-DD format"
    ),
  streetAddress: Yup.string()
    .max(100, 'The address cannot exceed 100 characters'),
  gender: Yup.number()
    .oneOf([0, 1, 2], "Invalid gender value")
    .required("Gender is required")
   
  
});

// Form data type
interface FormValues {
  userId: number | "" | undefined;
  firstName: string | "" | undefined;
  lastName: string | "" | undefined;
  avatar?: string | null | undefined;
  email: string | ""| undefined;
  phoneNumber: string | ""| undefined;
  birthdate: string | "" | undefined;
  streetAddress: string | ""| undefined;
  gender: number;
}


const ProfileForm = () => {
  const [preview, setPreview] = useState<string | null>(null);
  const [savePreview, setSavePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
    const [initialValues, setInitialValues] = useState<FormValues>({
    userId: 0,
    firstName: "",
    lastName:"",
    avatar: '',
    email: '',
    phoneNumber: '',
    birthdate: "",
    streetAddress: '',
    gender: Gender.Other
  });
  const navigate = useNavigate();
  
  const { user } = useSelector((state:RootState) => state.auth);
  console.log("from selector user gender is-----------", user?.gender);
  console.log("from selector user gender string to enum -----------", mapGenderStringToEnum(user?.gender));
  useEffect(()=>{
    setInitialValues({userId:user?.userId, firstName:user?.firstName, lastName: user?.lastName, avatar:'', email:user?.email, phoneNumber:user?.phone, birthdate:user?.birthdate, streetAddress:user?.address, gender:mapGenderStringToEnum(user?.gender) });
  },[user])

  return (
    <Box sx={{ padding: 3 }}>
      <Card>
        <CardHeader title="Profile" action={
          <IconButton aria-label="close" onClick={() => navigate(-1)}>
        <CloseIcon />
      </IconButton>
        }/>
        <Divider />
        <CardContent>
          <Grid container spacing={3}>
            {/* Avatar upload area */}
            <Grid item xs={12} md={4}>
              <AvatarCrop imageData={preview || ''} imageDataCallBack={setSavePreview} />
            </Grid>

            {/* form field */}
            <Grid item xs={12} md={8}>
              <Formik
                enableReinitialize={true}
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={async (values: FormValues, { setSubmitting }) => {  
                setIsLoading(true);
                setError("");
                //user data and profile data are stored in two separate tables in the backend,so need to update them both
                const { firstName,lastName, email, gender, ...rest } = values; 
                try {
                      let respFromUserTable = await put<FormValues>(`/users/${user?.userId}`, 
                        {
                           "firstName": values.firstName,
                          "lastName": values.lastName, 
                        }
                      )
                      console.log("gender before API enum to string is:---------", values.gender);
                      console.log("gender before send API enum to gender is:---------", mapGenderEnumToString(values.gender));
                      let respFromProfileTable = await put<FormValues>(`/profiles/${user?.profileId}`, 
                         {
                           ...rest,
                          gender: mapGenderEnumToString(values.gender),        
                         }
                      );
                      if (respFromUserTable.isSuccess && respFromProfileTable.isSuccess) {
                          toast.success("User profile update success !");
                        } else {
                          const msg = respFromUserTable.message || respFromProfileTable.message || "Update user profile failed" !
                         setError(msg);
                        }
                      } catch (err) {
                        setError("Update user profile failed !");
                      
                      } finally {
                        setIsLoading(false);
                        setSubmitting(false);
                      }         
          
                }}
              >
                {({ values, handleChange, handleBlur, errors, touched, isSubmitting,setFieldValue }) => (
                  <Form>
                    <Grid container spacing={2}>              
                    <Grid item xs={12}>
                        <TextField
                          name="email"
                          label="Email"
                          value={values.email}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          fullWidth
                          disabled
                          margin="normal"
                          variant="outlined"
                          error={touched.email && Boolean(errors.email)}
                          helperText={touched.email && errors.email}
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <TextField
                          name="firstName"
                          label="First Name"
                          value={values.firstName}
                          onChange={handleChange}
                          fullWidth
                          type="text"
                          margin="normal"
                          variant="outlined"
                        />
                      </Grid>

                        <Grid item xs={12}>
                        <TextField
                          name="lastName"
                          label="Last Name"
                          value={values.lastName}
                         onChange={handleChange}
                          fullWidth
                          type="text"
                          margin="normal"
                          variant="outlined"
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          name="phoneNumber"
                          label="Phone Number"
                          value={values.phoneNumber}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          fullWidth
                          margin="normal"
                          variant="outlined"
                          error={touched.phoneNumber && Boolean(errors.phoneNumber)}
                          helperText={touched.phoneNumber && errors.phoneNumber}
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <TextField
                          name="birthdate"
                          label="Birthdate"
                          value={values.birthdate}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          type="date"
                          fullWidth
                          margin="normal"
                          variant="outlined"
                          error={touched.birthdate && Boolean(errors.birthdate)}
                          helperText={touched.birthdate && errors.birthdate}
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <TextField
                          name="streetAddress"
                          label="Street Address"
                          value={values.streetAddress}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          fullWidth
                          margin="normal"
                          variant="outlined"
                          error={touched.streetAddress && Boolean(errors.streetAddress)}
                          helperText={touched.streetAddress && errors.streetAddress}
                        />
                      </Grid>
                      <Grid item xs={12}>
                      <FormControl fullWidth error={touched.gender && Boolean(errors.gender)}>
                      <InputLabel id="gender-label">Gender</InputLabel>
                        <Select
                          labelId='gender-label'
                          name="gender"
                          value={values.gender}
                          onChange={(e) => setFieldValue("gender", Number(e.target.value))}
                          onBlur={handleBlur}
                          fullWidth
                          label="Gender"
                        >
                          <MenuItem value={1}>Male</MenuItem>
                          <MenuItem value={2}>Female</MenuItem>
                          <MenuItem value={0}>Other</MenuItem>
                        </Select>
                        {touched.gender && errors.gender && <FormHelperText>{errors.gender}</FormHelperText>}
                      </FormControl>
                      </Grid>

                      <Grid item xs={12}>
                        <Button
                          type="submit"
                          variant="contained"
                          color="primary"
                          disabled={isSubmitting}
                          sx={{ width: '100%', mt: 2 }}
                        >
                          Save
                        </Button>
                      </Grid>
                    </Grid>
                  </Form>
                )}
              </Formik>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ProfileForm;