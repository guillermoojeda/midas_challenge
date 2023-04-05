import React, {useState} from 'react';
import ReactDOM from 'react-dom';
import { Formik, Form, useField } from 'formik';
import * as Yup from 'yup';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

import Copyright from '../Copyright/Copyright';
import { centeredBox, cardStyle } from '../muiStylesObjects';
import TextInput from '../../shared_components/TextInput';

import { useNavigate } from "react-router-dom";

import { createUser } from '../../databaseMock/actions';

const passwordRules = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{5,}$/;
// 1 numeric digit, 1 lower case letter, 1 upper case letter, 5 chars minimum.

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const SignupForm = () => {

  const [snackOpen, setSnackOpen] = useState(false);
  const [ans, setAns] = useState({});
  const [outcome, setOutcome] = useState('info')
  const navigate = useNavigate();

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackOpen(false);
  };

  const submitAction = async (signupData) => {
    
    const ans = await createUser(signupData);
    setAns(ans);
    if (ans.success) {
      const { name, lastname, email, password } = ans.userData;
      const user = { name, lastname, email, password }
      window.localStorage.setItem('user', JSON.stringify(user));
      window.localStorage.setItem('activities', JSON.stringify([]));
      
      navigate("/app/home");
    }
    setSnackOpen(true);
    setOutcome('error');
    return 'Error';
  };

  return (
    <Box sx={centeredBox}>
      <Typography variant="h4" align="center">Welcome to Do Something!!!</Typography>
      <Typography variant="body1" align="center">Create your user by submitting the required info.</Typography>
      <Formik
        initialValues={{
          firstName: '',
          lastname: '',
          email: '',
          acceptedTerms: false, // added for our checkbox
          jobType: '', // added for our select
        }}
        validationSchema={Yup.object({
          firstName: Yup.string()
            .min(3, 'Must contain at least 3 characters')
            .max(20, 'Must be 20 characters or less')
            .required('Required'),
          lastname: Yup.string()
            .min(3, 'Must contain at least 3 characters')
            .max(20, 'Must be 20 characters or less')
            .required('Required'),
          age: Yup.number()
            .required('Required')
            .test(
              'Is positive?', 
              'Must be greater than 0', 
              (value) => value > 0
            ),
          email: Yup.string()
            .email('Invalid email address')
            .required('Required'),
          password: Yup.string()
            .matches(passwordRules, { 
              message: 'Password insecure -- please include:\n' +
               "- at least 5 characters\n" +
               "- an uppercase letter\n" +
               "- lowercase letter and a number",
              })
            .required("Required"),
          confirmPassword: Yup.string()
            .oneOf([Yup.ref("password"), null], "Passwords must match")
            .required("Required"),
        })}
        onSubmit={(values, {setSubmitting}) => {
          setTimeout(() => { // we simulate async call
            setSubmitting(false);
          }, 400);
          const ans = submitAction(values);
          return ans;
        }}
      > 
        <Card
              variant="outlined"
              sx={cardStyle}
        >
          <Form>
            
              <TextInput
                label="First Name"
                name="firstName"
                type="text"
                placeholder="Jane"
              />

              <TextInput
                label="Last Name"
                name="lastname"
                type="text"
                placeholder="Doe"
              />

              <TextInput
                label="Age"
                name="age"
                type="number"
                placeholder="jane@formik.com"
              />

              <TextInput
                label="Email Address"
                name="email"
                type="email"
                placeholder="jane@formik.com"
              />

              <TextInput
                label="Password"
                name="password"
                type="password"
                placeholder="jane@formik.com"
              />

              <TextInput
                label="Confirm password"
                name="confirmPassword"
                type="password"
                placeholder="jane@formik.com"
              />
                <Box textAlign='center'>
                  <Button type="submit" variant="contained" sx={{margin: '1rem'}}>Submit</Button>
                </Box>
          </Form>
        </Card>
      </Formik>
      <Snackbar 
        open={snackOpen} 
        autoHideDuration={4000} 
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        sx={{minWidth:'80vw'}}
      >
        <Alert onClose={handleClose} severity={outcome} sx={{ width: '100%' }}>
          {
            outcome === 'success' ? 
            <span>Signup succesful</span> :
            <span>Error during user creation: {ans.message}</span>
          }
        </Alert>
      </Snackbar>
      <Typography variant="body1" align="center" sx={{marginTop:"1rem"}}>Already have an account? 
        <Link color='primary' href='/'> Login.</Link>
      </Typography>
      <Copyright />
    </Box>
  );
};

export default SignupForm;
